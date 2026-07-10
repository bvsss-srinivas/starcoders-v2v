from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Course, Module, Lesson, Enrollment, LessonProgress
from .serializers import CourseSerializer, ModuleSerializer, LessonSerializer, EnrollmentSerializer, LessonProgressSerializer
from apps.users.permissions import IsAdminRole

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'enroll']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminRole]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def enroll(self, request, slug=None):
        course = self.get_object()
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'status': 'active'}
        )
        if created:
            return Response({'status': 'enrolled', 'message': 'Successfully enrolled in course.'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'already_enrolled', 'message': 'You are already enrolled.'}, status=status.HTTP_200_OK)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminRole]
        return [permission() for permission in permission_classes]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminRole]
        return [permission() for permission in permission_classes]

class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(enrollment__user=self.request.user)

    def perform_update(self, serializer):
        # Auto-set completed_at if marked complete
        instance = serializer.save()
        if instance.is_completed and not instance.completed_at:
            instance.completed_at = timezone.now()
            instance.save()
            
        # Update enrollment progress
        enrollment = instance.enrollment
        total_lessons = Lesson.objects.filter(module__course=enrollment.course).count()
        if total_lessons > 0:
            completed_lessons = LessonProgress.objects.filter(enrollment=enrollment, is_completed=True).count()
            enrollment.progress_percentage = int((completed_lessons / total_lessons) * 100)
            if enrollment.progress_percentage == 100:
                enrollment.status = 'completed'
                if not enrollment.completed_at:
                    enrollment.completed_at = timezone.now()
            enrollment.save()
