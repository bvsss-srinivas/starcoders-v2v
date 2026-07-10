from rest_framework import permissions

class IsLearner(permissions.BasePermission):
    """
    Allows access only to learners.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'learner')

class IsMentor(permissions.BasePermission):
    """
    Allows access only to mentors.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'mentor')

class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to admin role (different from is_staff).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'admin' or request.user.is_staff))
