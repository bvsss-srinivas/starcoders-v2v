from django.urls import path
from .views import (
    TaskListCreateView, 
    TaskRetrieveUpdateDestroyView,
    DashboardSummaryView,
    GlobalSearchView
)

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('search/', GlobalSearchView.as_view(), name='global-search'),
]
