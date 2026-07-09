from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from apps.verification.permissions import IsVerifiedUser
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('completed', 'due_date', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
