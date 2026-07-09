from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from apps.verification.permissions import IsVerifiedUser
from .models import Resume
from .serializers import ResumeSerializer
import random

class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        # Simulate an AI score calculation
        mock_score = random.randint(65, 95)
        status = 'Optimized' if mock_score >= 85 else ('Targeted' if mock_score >= 75 else 'Needs Update')
        
        serializer.save(
            user=self.request.user,
            score=mock_score,
            status=status
        )
