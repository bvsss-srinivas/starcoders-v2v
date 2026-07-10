import os

# jobs/models.py
jobs_models = '''from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    job_type = models.CharField(max_length=100) # e.g. Full-time, Remote
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} at {self.company}"
'''

# finance/models.py
finance_models = '''from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FinancialGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='financial_goals')
    title = models.CharField(max_length=255)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.user.email}"
'''

# community/models.py
community_models = '''from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ForumPost(models.Model):
    CATEGORY_CHOICES = [
        ('tech', 'Technology'),
        ('finance', 'Finance'),
        ('design', 'Design'),
        ('general', 'General'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ForumComment(models.Model):
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forum_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.email} on {self.post.title}"
'''

# gamification/models.py
gamification_models = '''from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon_name = models.CharField(max_length=100) # e.g. 'ShieldCheck'
    
    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.email} earned {self.badge.name}"
'''

with open('apps/jobs/models.py', 'w') as f: f.write(jobs_models)
with open('apps/finance/models.py', 'w') as f: f.write(finance_models)
with open('apps/community/models.py', 'w') as f: f.write(community_models)
with open('apps/gamification/models.py', 'w') as f: f.write(gamification_models)

print("Created all models.")
