from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    ROLE_CHOICES = (
        ('learner', 'Learner'),
        ('mentor', 'Mentor'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='learner')
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('deleted', 'Deleted'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    email_verified_at = models.DateTimeField(blank=True, null=True)
    avatar_url = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Use email as the primary identifier instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
        
    @property
    def verification_status(self):
        if hasattr(self, 'verification'):
            return self.verification.status
        # Treat users without a record as pending — they need to submit verification
        return 'pending'

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    
    # Notifications (JSON to easily store boolean flags for in-app/email for multiple categories)
    # e.g., {"community": {"in_app": True, "email": False}, ...}
    notifications = models.JSONField(default=dict)
    
    # Privacy
    show_full_name_in_forum = models.BooleanField(default=True)
    
    # Appearance
    theme = models.CharField(max_length=20, default='light')
    
    # Security
    two_factor_enabled = models.BooleanField(default=False)

    def __str__(self):
        return f"Settings for {self.user.email}"

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"OTP for {self.user.email}"

# Auto-create settings when a user is created
@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(
            user=instance,
            notifications={
                'community': {'in_app': True, 'email': True},
                'jobs': {'in_app': True, 'email': False},
                'interviews': {'in_app': True, 'email': True},
                'finance': {'in_app': True, 'email': False},
                'verification': {'in_app': True, 'email': True},
            }
        )
        from apps.profiles.models import UserProfile
        UserProfile.objects.get_or_create(user=instance)
