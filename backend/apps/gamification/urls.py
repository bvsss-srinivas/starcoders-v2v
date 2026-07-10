from django.urls import path
from .views import UserBadgeListView

urlpatterns = [
    path('badges/', UserBadgeListView.as_view(), name='user-badges'),
]
