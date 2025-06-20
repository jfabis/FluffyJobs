from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # serializer_class = UserSerializer  # Dodamy później

class LoginView(TokenObtainPairView):
    pass

class ProfileView(generics.RetrieveUpdateAPIView):
    # serializer_class = UserSerializer  # Dodamy później
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
