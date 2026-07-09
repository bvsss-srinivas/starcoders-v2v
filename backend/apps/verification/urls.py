from django.urls import path
from .views import (
    VerificationSubmitView,
    VerificationStatusView,
    AdminVerificationListView,
    AdminVerificationApproveView,
    AdminVerificationRejectView,
    AdminVerificationDocumentView
)

urlpatterns = [
    path('submit/', VerificationSubmitView.as_view(), name='verification-submit'),
    path('status/', VerificationStatusView.as_view(), name='verification-status'),
    path('admin/', AdminVerificationListView.as_view(), name='admin-verification-list'),
    path('admin/<int:pk>/approve/', AdminVerificationApproveView.as_view(), name='admin-verification-approve'),
    path('admin/<int:pk>/reject/', AdminVerificationRejectView.as_view(), name='admin-verification-reject'),
    path('admin/<int:pk>/document/', AdminVerificationDocumentView.as_view(), name='admin-verification-document'),
]
