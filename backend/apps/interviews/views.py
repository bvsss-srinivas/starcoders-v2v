from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.verification.permissions import IsVerifiedUser
from .models import MockInterview
from .serializers import MockInterviewSerializer

class MockInterviewListCreateView(generics.ListCreateAPIView):
    serializer_class = MockInterviewSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get_queryset(self):
        return MockInterview.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
