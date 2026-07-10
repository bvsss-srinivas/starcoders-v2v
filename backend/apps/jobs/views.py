from rest_framework import generics
from .models import Job
from .serializers import JobSerializer
from apps.verification.permissions import IsVerifiedUser

class JobListAPIView(generics.ListAPIView):
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsVerifiedUser]
