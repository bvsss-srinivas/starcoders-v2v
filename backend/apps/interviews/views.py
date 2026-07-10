import time
import random
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import MockInterview
from .serializers import MockInterviewSerializer, MockInterviewListSerializer

# Simulated AI Question Bank
QUESTIONS = {
    'behavioral': [
        "Tell me about a time you had to deal with a difficult coworker.",
        "Describe a situation where you failed and how you handled it.",
        "How do you prioritize multiple deadlines?",
        "Tell me about a time you went above and beyond for a project.",
        "Describe your process for learning a completely new skill or technology."
    ],
    'technical': [
        "Explain the difference between functional and object-oriented programming.",
        "How would you design a scalable URL shortener system?",
        "Describe how a hash map works under the hood.",
        "What is the difference between TCP and UDP?",
        "Explain RESTful API principles and when you might choose GraphQL instead."
    ],
    'case_study': [
        "A client wants to double their app engagement in 3 months. How do you approach this?",
        "Our main competitor just launched a feature identical to ours but cheaper. What is our strategy?",
        "You are launching a new product in a foreign market. What are your first 3 steps?",
        "How would you price a new SaaS product targeted at enterprise customers?",
        "Estimate the number of windows in New York City."
    ]
}

class MockInterviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MockInterviewListSerializer
        return MockInterviewSerializer

    def get_queryset(self):
        return MockInterview.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        interview = serializer.save(user=self.request.user)
        # If no scheduled date is provided, we assume it's "Start Now"
        if not interview.scheduled_for:
            interview.status = 'in_progress'
            # Generate questions based on type
            q_list = random.sample(QUESTIONS.get(interview.type, QUESTIONS['behavioral']), 3)
            q_data = []
            for i, q in enumerate(q_list):
                q_data.append({
                    "id": i + 1,
                    "question": q,
                    "answer": "",
                    "completed": False
                })
            interview.questions_and_answers = q_data
            interview.save()

    @action(detail=True, methods=['post'])
    def start_scheduled(self, request, pk=None):
        interview = self.get_object()
        if interview.status != 'scheduled':
            return Response({"detail": "Only scheduled interviews can be started."}, status=status.HTTP_400_BAD_REQUEST)
        
        interview.status = 'in_progress'
        q_list = random.sample(QUESTIONS.get(interview.type, QUESTIONS['behavioral']), 3)
        q_data = []
        for i, q in enumerate(q_list):
            q_data.append({
                "id": i + 1,
                "question": q,
                "answer": "",
                "completed": False
            })
        interview.questions_and_answers = q_data
        interview.save()
        return Response(MockInterviewSerializer(interview).data)

    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        interview = self.get_object()
        if interview.status != 'in_progress':
            return Response({"detail": "Interview is not in progress."}, status=status.HTTP_400_BAD_REQUEST)
            
        question_id = request.data.get('question_id')
        answer_text = request.data.get('answer', '')
        
        q_data = interview.questions_and_answers
        for q in q_data:
            if q['id'] == question_id:
                q['answer'] = answer_text
                q['completed'] = True
                break
                
        interview.questions_and_answers = q_data
        interview.save()
        return Response({"status": "Answer saved"})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        interview = self.get_object()
        if interview.status != 'in_progress':
            return Response({"detail": "Interview is not in progress."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Simulate AI processing delay
        time.sleep(2)
        
        # Calculate a fake score based loosely on length of answers
        total_length = sum(len(q.get('answer', '')) for q in interview.questions_and_answers)
        base_score = min(total_length // 10, 60) # Up to 60 points for volume
        random_bonus = random.randint(10, 35) # Random bonus to make it look real
        
        final_score = base_score + random_bonus
        if total_length < 50:
            final_score = random.randint(20, 45) # Penalize very short answers
            
        final_score = min(final_score, 100)
        
        # Generate fake category breakdowns
        categories = {
            "Clarity": min(final_score + random.randint(-10, 10), 100),
            "Structure": min(final_score + random.randint(-15, 5), 100),
            "Confidence": min(final_score + random.randint(-5, 15), 100),
            "Technical Accuracy": min(final_score + random.randint(-10, 10), 100),
            "Relevance": min(final_score + random.randint(-5, 10), 100),
        }
        
        # Generic strengths and improvements
        strengths = [
            "Provided specific examples to back up claims.",
            "Maintained a good, logical structure in responses.",
            "Demonstrated strong enthusiasm for the role."
        ]
        
        improvements = [
            "Could use the STAR method more strictly to keep answers concise.",
            "Some technical explanations lacked depth.",
            "Try to pause instead of using filler words."
        ]
        
        interview.status = 'completed'
        interview.completed_at = timezone.now()
        interview.score = final_score
        interview.feedback = {
            "categories": categories,
            "strengths": random.sample(strengths, 2),
            "improvements": random.sample(improvements, 2),
            "action": "Review the STAR method and practice mock interviews focusing on conciseness."
        }
        interview.save()
        
        return Response(MockInterviewSerializer(interview).data)
