from django.db import models
from django.conf import settings

class MockInterview(models.Model):
    INTERVIEW_TYPES = [
        ('behavioral', 'Behavioral'),
        ('technical', 'Technical'),
        ('case_study', 'Case Study'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interviews')
    type = models.CharField(max_length=50, choices=INTERVIEW_TYPES, default='behavioral')
    role = models.CharField(max_length=255, default='Software Engineer')
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_LEVELS, default='intermediate')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='scheduled')
    
    scheduled_for = models.DateTimeField(null=True, blank=True)
    
    # Store questions and answers dynamically.
    # Format: [{"id": 1, "question": "Tell me...", "answer": "Well...", "completed": true}]
    questions_and_answers = models.JSONField(default=list, blank=True)
    
    score = models.IntegerField(null=True, blank=True)
    
    # Store detailed feedback.
    # Format: {"categories": {"clarity": 80, ...}, "strengths": [...], "improvements": [...], "action": "..."}
    feedback = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_type_display()} for {self.role} ({self.user.email})"
