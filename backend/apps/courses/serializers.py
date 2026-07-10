from rest_framework import serializers
from .models import Course, Module, Lesson, Enrollment, LessonProgress

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'module', 'title', 'content', 'video_url', 'order']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'order', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'category', 'level', 'duration_hours', 'thumbnail_url', 'created_at', 'updated_at', 'author', 'author_name', 'is_published', 'modules']
        read_only_fields = ['author', 'created_at', 'updated_at', 'slug']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() if obj.author else "ElevateHer Team"

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')
    course_slug = serializers.ReadOnlyField(source='course.slug')
    course_thumbnail = serializers.ReadOnlyField(source='course.thumbnail_url')

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'course_title', 'course_slug', 'course_thumbnail', 'status', 'progress_percentage', 'enrolled_at', 'completed_at']
        read_only_fields = ['user', 'enrolled_at', 'completed_at', 'progress_percentage']

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'enrollment', 'lesson', 'is_completed', 'completed_at', 'last_accessed']
        read_only_fields = ['last_accessed']
