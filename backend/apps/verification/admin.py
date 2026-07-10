from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse, path
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.http import FileResponse, Http404
from .models import Verification, VerificationHistory
from .services import approve_verification, reject_verification


class VerificationHistoryInline(admin.TabularInline):
    model = VerificationHistory
    extra = 0
    readonly_fields = ('status', 'reason', 'changed_by', 'timestamp')
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = (
        'user_email', 'user_full_name', 'id_type', 'id_number_masked',
        'status_badge', 'submitted_at', 'reviewed_at', 'document_link',
        'admin_actions'
    )
    list_filter = ('status', 'id_type', 'submitted_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'id_number_masked')
    ordering = ('-submitted_at',)
    readonly_fields = (
        'user', 'id_type', 'id_number_masked', 'submitted_at',
        'reviewed_at', 'reviewed_by', 'document_link'
    )
    inlines = [VerificationHistoryInline]

    fieldsets = (
        ('User Information', {
            'fields': ('user', 'id_type', 'id_number_masked', 'document_link')
        }),
        ('Verification Status', {
            'fields': ('status', 'rejection_reason', 'reviewed_by', 'reviewed_at')
        }),
        ('Timestamps', {
            'fields': ('submitted_at',)
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'
    user_email.admin_order_field = 'user__email'

    def user_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    user_full_name.short_description = 'Full Name'

    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'verified': '#10b981',
            'rejected': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{};color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'

    def document_link(self, obj):
        if obj.document_file:
            url = reverse('admin:verification_document', args=[obj.pk])
            return format_html('<a href="{}" target="_blank">📄 View Document</a>', url)
        return '—'
    document_link.short_description = 'Document'

    def admin_actions(self, obj):
        if obj.status == 'pending':
            approve_url = reverse('admin:verification_approve', args=[obj.pk])
            reject_url = reverse('admin:verification_reject', args=[obj.pk])
            return format_html(
                '<a href="{}" style="color:green;font-weight:600;margin-right:10px;">✓ Approve</a>'
                '<a href="{}" style="color:red;font-weight:600;">✗ Reject</a>',
                approve_url, reject_url
            )
        return '—'
    admin_actions.short_description = 'Actions'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:pk>/approve/', self.admin_site.admin_view(self.approve_view), name='verification_approve'),
            path('<int:pk>/reject/', self.admin_site.admin_view(self.reject_view), name='verification_reject'),
            path('<int:pk>/document/', self.admin_site.admin_view(self.document_view), name='verification_document'),
        ]
        return custom_urls + urls

    def approve_view(self, request, pk):
        verification = get_object_or_404(Verification, pk=pk)
        try:
            approve_verification(verification, request.user)
            messages.success(request, f"Verification for {verification.user.email} has been APPROVED.")
        except Exception as e:
            messages.error(request, str(e))
        return redirect('admin:verification_verification_changelist')

    def reject_view(self, request, pk):
        verification = get_object_or_404(Verification, pk=pk)
        if request.method == 'POST':
            reason = request.POST.get('reason', '').strip()
            if not reason:
                messages.error(request, "A rejection reason is required.")
                return redirect(request.path)
            try:
                reject_verification(verification, request.user, reason)
                messages.success(request, f"Verification for {verification.user.email} has been REJECTED.")
            except Exception as e:
                messages.error(request, str(e))
            return redirect('admin:verification_verification_changelist')

        # GET: render simple rejection form
        return self.admin_site.each_context(request)

    def reject_view(self, request, pk):
        verification = get_object_or_404(Verification, pk=pk)
        if request.method == 'POST':
            reason = request.POST.get('reason', '').strip()
            if not reason:
                messages.error(request, "A rejection reason is required.")
            else:
                try:
                    reject_verification(verification, request.user, reason)
                    messages.success(request, f"Verification for {verification.user.email} has been REJECTED.")
                except Exception as e:
                    messages.error(request, str(e))
            return redirect('admin:verification_verification_changelist')

        context = {
            **self.admin_site.each_context(request),
            'verification': verification,
            'title': f'Reject Verification for {verification.user.email}',
        }
        from django.shortcuts import render
        return render(request, 'admin/verification_reject.html', context)

    def document_view(self, request, pk):
        verification = get_object_or_404(Verification, pk=pk)
        if not verification.document_file:
            raise Http404("No document available.")
        file_handle = verification.document_file.open('rb')
        response = FileResponse(file_handle, content_type='application/octet-stream')
        filename = verification.document_file.name.split('/')[-1]
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


@admin.register(VerificationHistory)
class VerificationHistoryAdmin(admin.ModelAdmin):
    list_display = ('verification_user', 'status', 'reason', 'changed_by', 'timestamp')
    list_filter = ('status',)
    readonly_fields = ('verification', 'status', 'reason', 'changed_by', 'timestamp')

    def verification_user(self, obj):
        return obj.verification.user.email
    verification_user.short_description = 'User'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
