from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.verification.permissions import IsVerifiedUser
from .models import Task
from .serializers import TaskSerializer
from django.utils import timezone
from django.db.models import Q

# Import models from other apps for aggregation
from apps.finance.models import FinancialGoal
from apps.jobs.models import Job
from apps.community.models import ForumPost, Notification
from apps.interviews.models import MockInterview
from apps.resumes.models import Resume

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('completed', 'due_date', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class DashboardSummaryView(views.APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get(self, request):
        user = request.user
        
        # 1. Finance Goals (Top 2 active)
        goals = FinancialGoal.objects.filter(user=user).order_by('-created_at')[:2]
        finance_data = [
            {
                "id": g.id,
                "name": g.title,
                "category": g.category,
                "target_amount": float(g.target_amount),
                "current_amount": float(g.current_amount),
                "percentage": int((g.current_amount / g.target_amount) * 100) if g.target_amount > 0 else 0
            } for g in goals
        ]

        # 2. Upcoming Interview (Next scheduled one that hasn't happened yet)
        next_interview = MockInterview.objects.filter(
            user=user, 
            status='scheduled', 
            scheduled_at__gte=timezone.now()
        ).order_by('scheduled_at').first()
        
        interview_data = None
        if next_interview:
            interview_data = {
                "id": next_interview.id,
                "title": next_interview.title,
                "interview_type": next_interview.interview_type,
                "scheduled_at": next_interview.scheduled_at,
            }

        # 3. Resume Status (Primary or most recent)
        resume = Resume.objects.filter(user=user).order_by('-is_primary', '-uploaded_at').first()
        resume_data = None
        if resume:
            resume_data = {
                "id": resume.id,
                "filename": resume.filename,
                "score": resume.score,
                "status": resume.status,
                "target_role": resume.target_role,
            }

        # 4. Job Matches (Top 3)
        # In a real app this would use NLP or trigram matching against user profile/resume.
        # Here we'll just pull the newest 3 jobs.
        jobs = Job.objects.filter(is_active=True).order_by('-created_at')[:3]
        jobs_data = [
            {
                "id": j.id,
                "title": j.title,
                "company": j.company,
                "location": j.location,
                "salary_range": j.salary_range,
                "category": j.category
            } for j in jobs
        ]

        # 5. Community Activity (Top 3 recent notifications)
        notifications = Notification.objects.filter(user=user).order_by('-created_at')[:3]
        community_data = [
            {
                "id": n.id,
                "message": n.message,
                "created_at": n.created_at,
                "is_read": n.is_read
            } for n in notifications
        ]
        
        # If no notifications, fallback to 3 trending posts
        if not community_data:
            posts = ForumPost.objects.all().order_by('-created_at')[:3]
            community_data = [
                {
                    "id": p.id,
                    "title": p.title,
                    "author": p.user.username,
                    "category": p.category,
                    "created_at": p.created_at,
                    "type": "post" # marker to differentiate from notification
                } for p in posts
            ]

        # 6. Streak / Engagement
        # Mocking a 3-day streak for the dashboard feature requirement
        streak_data = {
            "days": 3,
            "label": "Active this week"
        }

        return Response({
            "finance_goals": finance_data,
            "next_interview": interview_data,
            "resume": resume_data,
            "job_matches": jobs_data,
            "community_activity": community_data,
            "streak": streak_data
        })


class GlobalSearchView(views.APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"jobs": [], "community": [], "resumes": []})

        user = request.user

        # Search Jobs
        jobs = Job.objects.filter(
            Q(title__icontains=query) | Q(company__icontains=query),
            is_active=True
        )[:5]
        jobs_results = [
            {"id": j.id, "title": j.title, "subtitle": j.company, "url": f"/jobs"} for j in jobs
        ]

        # Search Community Posts
        posts = ForumPost.objects.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:5]
        posts_results = [
            {"id": p.id, "title": p.title, "subtitle": f"By {p.user.username} in {p.category}", "url": f"/community"} for p in posts
        ]

        # Search Resumes (Only user's own resumes)
        resumes = Resume.objects.filter(
            Q(filename__icontains=query) | Q(target_role__icontains=query),
            user=user
        )[:5]
        resumes_results = [
            {"id": r.id, "title": r.filename, "subtitle": r.target_role or "General", "url": f"/resumes"} for r in resumes
        ]

        return Response({
            "jobs": jobs_results,
            "community": posts_results,
            "resumes": resumes_results
        })
