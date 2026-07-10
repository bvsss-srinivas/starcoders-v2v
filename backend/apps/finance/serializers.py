from rest_framework import serializers
from .models import FinancialGoal, GoalContribution

class GoalContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalContribution
        fields = '__all__'
        read_only_fields = ['goal', 'date']

class FinancialGoalSerializer(serializers.ModelSerializer):
    contributions = GoalContributionSerializer(many=True, read_only=True)

    class Meta:
        model = FinancialGoal
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
