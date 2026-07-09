from django.urls import path
from .views import MockInterviewListCreateView

urlpatterns = [
    path('', MockInterviewListCreateView.as_view(), name='interview-list-create'),
]
