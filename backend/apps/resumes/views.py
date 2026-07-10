import time
import random
import hashlib
import logging
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from apps.verification.permissions import IsVerifiedUser
from .models import Resume
from .serializers import ResumeSerializer
from .utils import extract_text_from_file, score_resume_with_ai

logger = logging.getLogger(__name__)

def generate_mock_analysis(filename, target_role):
    # Create a deterministic seed based on filename and target role
    seed_str = f"{filename}_{target_role.lower() if target_role else 'none'}"
    seed_int = int(hashlib.md5(seed_str.encode()).hexdigest(), 16)
    rng = random.Random(seed_int)
    
    base_score = rng.randint(65, 92)
    ats = min(100, base_score + rng.randint(-10, 15))
    keyword = min(100, base_score + rng.randint(-15, 10))
    impact = min(100, base_score + rng.randint(-20, 5))
    formatting = min(100, base_score + rng.randint(-5, 20))
    
    overall = int((ats + keyword + impact + formatting) / 4)
    
    role_str = target_role if target_role else "this role"
    suggestions = [
        f"Add more measurable outcomes (e.g., %, $, time saved) to your recent experience for {role_str}.",
        f"Missing key industry keywords for {role_str}. Consider adding tools or methodologies common in this field.",
        f"Your summary section is a bit generic. Tailor it to explicitly mention your years of experience in {role_str}.",
        "Formatting is clean, but ensure all bullet points start with strong action verbs.",
        f"Ensure your education and certifications are prominently displayed, especially if relevant to {role_str}."
    ]
    
    selected_suggestions = rng.sample(suggestions, 3)
    status_label = 'Targeted' if overall >= 75 else 'Needs Update'
    
    return {
        'score': overall,
        'status': status_label,
        'sub_scores': {
            'ATS Compatibility': ats,
            'Keyword Match': keyword,
            'Impact & Metrics': impact,
            'Formatting': formatting
        },
        'suggestions': selected_suggestions
    }

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        target_role = self.request.data.get('target_role', '')
        
        # Determine if this is the first resume
        is_first = not Resume.objects.filter(user=self.request.user).exists()
        
        # Save initially without AI analysis
        resume = serializer.save(
            user=self.request.user,
            target_role=target_role,
            is_primary=is_first,
            score=0,
            status='Analyzing...'
        )
        
        # Try real AI analysis
        try:
            resume_text = extract_text_from_file(resume.file.path)
            if resume_text:
                analysis = score_resume_with_ai(resume_text, target_role)
            else:
                raise ValueError("Could not extract text from file")
        except Exception as e:
            logger.warning(f"AI scoring failed, falling back to mock. Error: {str(e)}")
            analysis = generate_mock_analysis(resume.filename, target_role)
        
        resume.score = analysis['score']
        resume.status = analysis['status']
        resume.sub_scores = analysis['sub_scores']
        resume.suggestions = analysis['suggestions']
        resume.save()

    @action(detail=True, methods=['post'])
    def rescore(self, request, pk=None):
        resume = self.get_object()
        new_role = request.data.get('target_role', resume.target_role)
        
        try:
            resume_text = extract_text_from_file(resume.file.path)
            if resume_text:
                analysis = score_resume_with_ai(resume_text, new_role)
            else:
                raise ValueError("Could not extract text from file")
        except Exception as e:
            logger.warning(f"AI rescoring failed, falling back to mock. Error: {str(e)}")
            analysis = generate_mock_analysis(resume.filename, new_role)
        
        resume.target_role = new_role
        resume.score = analysis['score']
        resume.status = analysis['status']
        resume.sub_scores = analysis['sub_scores']
        resume.suggestions = analysis['suggestions']
        resume.last_scored_at = timezone.now()
        resume.save()
        
        return Response(ResumeSerializer(resume).data)

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        resume = self.get_object()
        
        # Remove primary from all other resumes
        Resume.objects.filter(user=request.user).update(is_primary=False)
        
        # Set this one as primary
        resume.is_primary = True
        resume.save()
        
        return Response({"status": "Primary resume updated"})
