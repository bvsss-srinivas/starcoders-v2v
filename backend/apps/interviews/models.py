from django.db import models
from django.conf import settings

class MockInterview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interviews')
    role = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    date = models.CharField(max_length=100)
    time = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Upcoming')
    score = models.IntegerField(null=True, blank=True)
    strengths = models.JSONField(default=list, blank=True)
    improvement = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} at {self.company} for {self.user.email}"
