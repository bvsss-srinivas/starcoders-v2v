from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ForumPostViewSet,
    ForumCommentViewSet,
    NotificationListView,
    NotificationMarkReadView,
    AdminReportedContentViewSet
)

router = DefaultRouter()
router.register(r'posts', ForumPostViewSet, basename='forumpost')
router.register(r'admin/reports', AdminReportedContentViewSet, basename='admin-reports')

urlpatterns = [
    path('', include(router.urls)),
    
    # Nested routes for comments
    path('posts/<int:post_pk>/comments/', ForumCommentViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-comments'),
    path('posts/<int:post_pk>/comments/<int:pk>/', ForumCommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='post-comment-detail'),
    path('posts/<int:post_pk>/comments/<int:pk>/toggle_upvote/', ForumCommentViewSet.as_view({'post': 'toggle_upvote'}), name='post-comment-upvote'),
    path('posts/<int:post_pk>/comments/<int:pk>/mark_best/', ForumCommentViewSet.as_view({'post': 'mark_best'}), name='post-comment-mark-best'),
    path('posts/<int:post_pk>/comments/<int:pk>/report/', ForumCommentViewSet.as_view({'post': 'report'}), name='post-comment-report'),

    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/mark-read/', NotificationMarkReadView.as_view(), name='notifications-mark-read'),
]
