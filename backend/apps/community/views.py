from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from .models import ForumPost, ForumComment, ReportedContent, Notification
from .serializers import (
    ForumPostSerializer, 
    ForumCommentSerializer, 
    ReportedContentSerializer, 
    NotificationSerializer
)
from apps.verification.permissions import IsVerifiedUser

class ForumPostViewSet(viewsets.ModelViewSet):
    serializer_class = ForumPostSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        queryset = ForumPost.objects.all()
        
        # Filtering
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(content__icontains=search))

        # Sorting
        sort = self.request.query_params.get('sort', 'recent')
        queryset = queryset.annotate(comment_count=Count('comments'))
        
        if sort == 'commented':
            queryset = queryset.order_by('-comment_count', '-created_at')
        elif sort == 'unanswered':
            queryset = queryset.filter(comment_count=0).order_by('-created_at')
        else: # recent
            queryset = queryset.order_by('-created_at')

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_upvote(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if post.upvotes.filter(id=user.id).exists():
            post.upvotes.remove(user)
            return Response({'status': 'unvoted'}, status=status.HTTP_200_OK)
        else:
            post.upvotes.add(user)
            return Response({'status': 'upvoted'}, status=status.HTTP_200_OK)
            
    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        post = self.get_object()
        reason = request.data.get('reason')
        details = request.data.get('details', '')
        if not reason:
            return Response({'error': 'Reason is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        ReportedContent.objects.create(
            reporter=request.user,
            post=post,
            reason=reason,
            details=details
        )
        return Response({'status': 'Report submitted successfully'}, status=status.HTTP_201_CREATED)

class ForumCommentViewSet(viewsets.ModelViewSet):
    serializer_class = ForumCommentSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return ForumComment.objects.filter(post_id=self.kwargs['post_pk'])

    def perform_create(self, serializer):
        post = get_object_or_404(ForumPost, pk=self.kwargs['post_pk'])
        comment = serializer.save(user=self.request.user, post=post)
        
        # Notifications logic
        participants = set(post.comments.values_list('user', flat=True))
        if post.user.id not in participants:
            participants.add(post.user.id)
            
        # Remove the person making the comment from being notified
        participants.discard(self.request.user.id)
        
        for user_id in participants:
            Notification.objects.create(
                recipient_id=user_id,
                actor=self.request.user,
                post=post,
                message=f"{self.request.user.first_name or self.request.user.username} replied to a thread you follow."
            )

    @action(detail=True, methods=['post'])
    def toggle_upvote(self, request, post_pk=None, pk=None):
        comment = self.get_object()
        user = request.user
        if comment.upvotes.filter(id=user.id).exists():
            comment.upvotes.remove(user)
            return Response({'status': 'unvoted'}, status=status.HTTP_200_OK)
        else:
            comment.upvotes.add(user)
            return Response({'status': 'upvoted'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def mark_best(self, request, post_pk=None, pk=None):
        comment = self.get_object()
        post = comment.post
        if request.user != post.user:
            return Response({'error': 'Only the post author can mark a best answer.'}, status=status.HTTP_403_FORBIDDEN)
            
        # Reset any existing best answer
        post.comments.filter(is_best_answer=True).update(is_best_answer=False)
        
        comment.is_best_answer = True
        comment.save()
        return Response({'status': 'Best answer marked'}, status=status.HTTP_200_OK)
        
    @action(detail=True, methods=['post'])
    def report(self, request, post_pk=None, pk=None):
        comment = self.get_object()
        reason = request.data.get('reason')
        details = request.data.get('details', '')
        if not reason:
            return Response({'error': 'Reason is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        ReportedContent.objects.create(
            reporter=request.user,
            comment=comment,
            reason=reason,
            details=details
        )
        return Response({'status': 'Report submitted successfully'}, status=status.HTTP_201_CREATED)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsVerifiedUser]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

class NotificationMarkReadView(generics.UpdateAPIView):
    permission_classes = [IsVerifiedUser]
    
    def update(self, request, *args, **kwargs):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'All marked as read'})

class AdminReportedContentViewSet(viewsets.ModelViewSet):
    serializer_class = ReportedContentSerializer
    
    def get_queryset(self):
        if not self.request.user.is_staff:
            return ReportedContent.objects.none()
        return ReportedContent.objects.all().order_by('resolved', '-created_at')
        
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=403)
        report = self.get_object()
        report.resolved = True
        report.save()
        return Response({'status': 'Resolved'})

    @action(detail=True, methods=['post'])
    def delete_content(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=403)
        report = self.get_object()
        if report.post:
            report.post.delete()
        if report.comment:
            report.comment.delete()
        report.resolved = True
        report.save()
        return Response({'status': 'Content deleted and report resolved'})
