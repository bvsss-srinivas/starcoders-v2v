from rest_framework import serializers
from .models import ForumPost, ForumComment, ReportedContent, Notification
from apps.users.serializers import UserSerializer

class ForumCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    upvote_count = serializers.IntegerField(source='upvotes.count', read_only=True)
    has_upvoted = serializers.SerializerMethodField()

    class Meta:
        model = ForumComment
        fields = '__all__'
        read_only_fields = ['user', 'post', 'created_at', 'upvotes', 'is_best_answer']

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False

class ForumPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    upvote_count = serializers.IntegerField(source='upvotes.count', read_only=True)
    has_upvoted = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'upvotes']

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False

    def get_comments(self, obj):
        # Order comments by best_answer first, then chronological
        comments = obj.comments.all().order_by('-is_best_answer', 'created_at')
        return ForumCommentSerializer(comments, many=True, context=self.context).data

class ReportedContentSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True, allow_null=True)
    comment_content = serializers.CharField(source='comment.content', read_only=True, allow_null=True)

    class Meta:
        model = ReportedContent
        fields = '__all__'
        read_only_fields = ['reporter', 'created_at', 'resolved']

class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)
    post_id = serializers.IntegerField(source='post.id', read_only=True, allow_null=True)
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['recipient', 'actor', 'post', 'created_at']
