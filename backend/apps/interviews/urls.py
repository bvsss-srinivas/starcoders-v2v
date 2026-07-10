from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MockInterviewViewSet

router = DefaultRouter()
router.register(r'interviews', MockInterviewViewSet, basename='mockinterview')

urlpatterns = [
    path('', include(router.urls)),
]
