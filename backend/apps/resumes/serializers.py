from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ['id', 'filename', 'target_role', 'score', 'status', 'sub_scores', 'suggestions', 'is_primary', 'uploaded_at', 'last_scored_at', 'file', 'file_url']
        read_only_fields = ['id', 'score', 'status', 'sub_scores', 'suggestions', 'uploaded_at', 'last_scored_at', 'file_url']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None
