from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import FinancialGoal, GoalContribution
from .serializers import FinancialGoalSerializer, GoalContributionSerializer
from apps.verification.permissions import IsVerifiedUser

class FinancialGoalListCreateView(generics.ListCreateAPIView):
    serializer_class = FinancialGoalSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return FinancialGoal.objects.filter(user=self.request.user).order_by('target_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FinancialGoalUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FinancialGoalSerializer
    permission_classes = [IsVerifiedUser]

    def get_queryset(self):
        return FinancialGoal.objects.filter(user=self.request.user)

class GoalContributionCreateView(generics.CreateAPIView):
    serializer_class = GoalContributionSerializer
    permission_classes = [IsVerifiedUser]

    def create(self, request, *args, **kwargs):
        goal = get_object_or_404(FinancialGoal, pk=kwargs['goal_id'], user=request.user)
        amount = request.data.get('amount')
        
        try:
            amount = float(amount)
            if amount <= 0 or amount > 10000000:
                return Response({"error": "Invalid amount."}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({"error": "Amount must be a number."}, status=status.HTTP_400_BAD_REQUEST)

        # Create contribution and update goal amount
        contribution = GoalContribution.objects.create(goal=goal, amount=amount)
        
        goal.current_amount = float(goal.current_amount) + amount
        goal.save()

        # Return updated goal
        return Response(FinancialGoalSerializer(goal).data, status=status.HTTP_201_CREATED)
