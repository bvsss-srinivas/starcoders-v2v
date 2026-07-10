from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'bio', 'education_level', 'current_role', 'stem_field', 'career_goal', 'location', 'linkedin_url', 'resume_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
