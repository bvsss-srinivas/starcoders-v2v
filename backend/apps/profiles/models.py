from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    education_level = models.CharField(max_length=100, blank=True, default='')
    current_role = models.CharField(max_length=100, blank=True, default='')
    stem_field = models.CharField(max_length=100, blank=True, default='')
    career_goal = models.TextField(blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')
    linkedin_url = models.URLField(max_length=500, blank=True, default='')
    resume_url = models.URLField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.email}"
