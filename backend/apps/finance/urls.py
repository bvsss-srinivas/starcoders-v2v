from django.urls import path
from .views import FinancialGoalListCreateView, FinancialGoalUpdateView, GoalContributionCreateView

urlpatterns = [
    path('goals/', FinancialGoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:pk>/', FinancialGoalUpdateView.as_view(), name='goal-update'),
    path('goals/<int:goal_id>/contributions/', GoalContributionCreateView.as_view(), name='goal-contribution'),
]
