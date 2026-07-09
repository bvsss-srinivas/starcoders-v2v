from django.utils import timezone
from .models import Verification, VerificationHistory

def submit_verification(user, id_type, id_number_masked, document_file):
    # Check if a pending or verified verification already exists
    if hasattr(user, 'verification'):
        verification = user.verification
        if verification.status == 'verified' or (verification.status == 'pending' and verification.document_file):
            raise ValueError(f"Verification already exists with status: {verification.status}")
        # If rejected or pending without document (from registration), allow resubmission
        verification.id_type = id_type
        verification.id_number_masked = id_number_masked
        verification.document_file = document_file
        verification.status = 'pending'
        verification.rejection_reason = None
        verification.submitted_at = timezone.now()
        verification.save()
    else:
        verification = Verification.objects.create(
            user=user,
            id_type=id_type,
            id_number_masked=id_number_masked,
            document_file=document_file
        )
    
    VerificationHistory.objects.create(
        verification=verification,
        status='pending',
        changed_by=user
    )
    return verification

def approve_verification(verification, admin_user):
    verification.status = 'verified'
    verification.rejection_reason = None
    verification.reviewed_at = timezone.now()
    verification.reviewed_by = admin_user
    verification.save()

    VerificationHistory.objects.create(
        verification=verification,
        status='verified',
        changed_by=admin_user
    )
    return verification

def reject_verification(verification, admin_user, reason):
    if not reason:
        raise ValueError("Rejection reason is required")
        
    verification.status = 'rejected'
    verification.rejection_reason = reason
    verification.reviewed_at = timezone.now()
    verification.reviewed_by = admin_user
    verification.save()

    VerificationHistory.objects.create(
        verification=verification,
        status='rejected',
        reason=reason,
        changed_by=admin_user
    )
    return verification
