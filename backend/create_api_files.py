import os

def create_file(path, content):
    with open(path, 'w') as f:
        f.write(content)

# JOBS APP
create_file('apps/jobs/serializers.py', '''from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
''')

create_file('apps/jobs/views.py', '''from rest_framework import generics
from .models import Job
from .serializers import JobSerializer
from apps.verification.permissions import IsVerifiedUser

class JobListAPIView(generics.ListAPIView):
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsVerifiedUser]
''')

create_file('apps/jobs/urls.py', '''from django.urls import path
from .views import JobListAPIView

urlpatterns = [
    path('', JobListAPIView.as_view(), name='job-list'),
]
''')

# FINANCE APP
create_file('apps/finance/serializers.py', '''from rest_framework import serializers
from .models import FinancialGoal

class FinancialGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialGoal
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
''')

create_file('apps/finance/views.py', '''from rest_framework import generics
from .models import FinancialGoal
from .serializers import FinancialGoalSerializer
from apps.verification.permissions import IsVerifiedUser

class FinancialGoalListCreateView(generics.ListCreateAPIView):
    serializer_class = FinancialGoalSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return FinancialGoal.objects.filter(user=self.request.user).order_by('target_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FinancialGoalUpdateView(generics.UpdateAPIView):
    serializer_class = FinancialGoalSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return FinancialGoal.objects.filter(user=self.request.user)
''')

create_file('apps/finance/urls.py', '''from django.urls import path
from .views import FinancialGoalListCreateView, FinancialGoalUpdateView

urlpatterns = [
    path('goals/', FinancialGoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:pk>/', FinancialGoalUpdateView.as_view(), name='goal-update'),
]
''')

# COMMUNITY APP
create_file('apps/community/serializers.py', '''from rest_framework import serializers
from .models import ForumPost, ForumComment
from apps.users.serializers import UserSerializer

class ForumCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ForumComment
        fields = '__all__'
        read_only_fields = ['user', 'post', 'created_at']

class ForumPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comments = ForumCommentSerializer(many=True, read_only=True)
    class Meta:
        model = ForumPost
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
''')

create_file('apps/community/views.py', '''from rest_framework import generics
from .models import ForumPost, ForumComment
from .serializers import ForumPostSerializer, ForumCommentSerializer
from apps.verification.permissions import IsVerifiedUser

class ForumPostListCreateView(generics.ListCreateAPIView):
    queryset = ForumPost.objects.all().order_by('-created_at')
    serializer_class = ForumPostSerializer
    permission_classes = [IsVerifiedUser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ForumCommentCreateView(generics.CreateAPIView):
    serializer_class = ForumCommentSerializer
    permission_classes = [IsVerifiedUser]

    def perform_create(self, serializer):
        post = ForumPost.objects.get(pk=self.kwargs['post_id'])
        serializer.save(user=self.request.user, post=post)
''')

create_file('apps/community/urls.py', '''from django.urls import path
from .views import ForumPostListCreateView, ForumCommentCreateView

urlpatterns = [
    path('posts/', ForumPostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:post_id>/comments/', ForumCommentCreateView.as_view(), name='comment-create'),
]
''')

# GAMIFICATION APP
create_file('apps/gamification/serializers.py', '''from rest_framework import serializers
from .models import Badge, UserBadge

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    class Meta:
        model = UserBadge
        fields = '__all__'
''')

create_file('apps/gamification/views.py', '''from rest_framework import generics
from .models import UserBadge
from .serializers import UserBadgeSerializer
from apps.verification.permissions import IsVerifiedUser

class UserBadgeListView(generics.ListAPIView):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).order_by('-earned_at')
''')

create_file('apps/gamification/urls.py', '''from django.urls import path
from .views import UserBadgeListView

urlpatterns = [
    path('badges/', UserBadgeListView.as_view(), name='user-badges'),
]
''')

print("Created serializers, views, urls.")
