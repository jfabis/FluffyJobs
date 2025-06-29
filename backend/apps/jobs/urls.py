from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('<int:job_id>/apply/', views.apply_for_job, name='apply-job'),
    path('saved/', views.SavedJobListView.as_view(), name='saved-jobs-list'),
    path('save/', views.save_job, name='save-job'),
    path('<int:job_id>/unsave/', views.unsave_job, name='unsave-job'),
    path('<int:job_id>/check-saved/', views.check_saved_job, name='check-saved-job'),
]
