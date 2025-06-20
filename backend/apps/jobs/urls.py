from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('<int:job_id>/apply/', views.apply_for_job, name='apply-job'),
]
