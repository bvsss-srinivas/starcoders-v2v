from django.db import models
from django.conf import settings

class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/')
    filename = models.CharField(max_length=255)
    
    target_role = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    
    score = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='Uploaded')
    
    # Store sub-scores (ATS, Keyword, Impact, Formatting)
    sub_scores = models.JSONField(default=dict, blank=True)
    # Store specific actionable suggestions
    suggestions = models.JSONField(default=list, blank=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_scored_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.filename} - {self.user.email}"
