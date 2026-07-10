from rest_framework import serializers
from .models import MockInterview

class MockInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockInterview
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'completed_at', 'questions_and_answers', 'score', 'feedback']

class MockInterviewListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockInterview
        fields = ['id', 'type', 'role', 'difficulty', 'status', 'scheduled_for', 'score', 'created_at', 'completed_at']
