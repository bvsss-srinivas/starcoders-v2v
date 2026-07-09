from rest_framework import serializers
from .models import Verification
from apps.users.serializers import UserSerializer

class VerificationSubmitSerializer(serializers.Serializer):
    id_type = serializers.ChoiceField(choices=Verification.ID_TYPE_CHOICES)
    id_number_masked = serializers.CharField(max_length=20)
    document_file = serializers.FileField()

class VerificationStatusSerializer(serializers.ModelSerializer):
    has_document = serializers.SerializerMethodField()

    class Meta:
        model = Verification
        fields = ['status', 'id_type', 'rejection_reason', 'submitted_at', 'reviewed_at', 'has_document']
        read_only_fields = fields

    def get_has_document(self, obj):
        return bool(obj.document_file)

class AdminVerificationListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Verification
        fields = ['id', 'user', 'status', 'id_type', 'submitted_at', 'reviewed_at']

class AdminVerificationActionSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True)
