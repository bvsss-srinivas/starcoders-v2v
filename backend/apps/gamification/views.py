from rest_framework import generics
from .models import UserBadge
from .serializers import UserBadgeSerializer
from apps.verification.permissions import IsVerifiedUser

class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).order_by('-earned_at')
