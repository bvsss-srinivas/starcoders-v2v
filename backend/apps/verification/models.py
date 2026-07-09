import os
import uuid
from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.exceptions import ValidationError

private_storage = FileSystemStorage(location=settings.PRIVATE_MEDIA_ROOT)

def secure_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join(f"user_{instance.user.id}", 'verification', filename)

from .validators import validate_file_type

def validate_file_size(value):
    limit = 10 * 1024 * 1024
    if value.size > limit:
        raise ValidationError('File too large. Size should not exceed 10 MB.')

class Verification(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected')
    ]
    ID_TYPE_CHOICES = [
        ('aadhaar', 'Aadhaar Card'),
        ('passport', 'Passport'),
        ('driving_licence', 'Driving Licence'),
        ('voter_id', 'Voter ID'),
        ('other', 'Other')
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='verification')
    id_type = models.CharField(max_length=20, choices=ID_TYPE_CHOICES, blank=True, null=True)
    id_number_masked = models.CharField(max_length=20, blank=True, null=True)
    document_file = models.FileField(
        upload_to=secure_upload_path,
        storage=private_storage,
        validators=[validate_file_size, validate_file_type],
        blank=True,
        null=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviewed_verifications')

    def __str__(self):
        return f"Verification for {self.user.email} - {self.status}"

class VerificationHistory(models.Model):
    verification = models.ForeignKey(Verification, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=20, choices=Verification.STATUS_CHOICES)
    reason = models.TextField(blank=True, null=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='verification_changes')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.verification.user.email} changed to {self.status} at {self.timestamp}"
