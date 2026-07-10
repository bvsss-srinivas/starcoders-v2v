from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FinancialGoal(models.Model):
    CATEGORY_CHOICES = (
        ('emergency', 'Emergency Fund'),
        ('investment', 'Investment'),
        ('debt', 'Debt Payoff'),
        ('purchase', 'Big Purchase'),
        ('education', 'Education'),
        ('other', 'Other')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='financial_goals')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.user.email}"

class GoalContribution(models.Model):
    goal = models.ForeignKey(FinancialGoal, on_delete=models.CASCADE, related_name='contributions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"₹{self.amount} to {self.goal.title}"
