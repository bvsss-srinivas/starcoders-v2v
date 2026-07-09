from rest_framework import permissions

class IsVerifiedUser(permissions.BasePermission):
    message = {"verification_status": "unverified"}
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if hasattr(request.user, 'verification'):
            if request.user.verification.status == 'verified':
                return True
            self.message = {"verification_status": request.user.verification.status}
        else:
            self.message = {"verification_status": "unverified"}
            
        return False

class IsAdminOrVerifier(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
