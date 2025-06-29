from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('google/', views.google_auth, name='google-auth'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
