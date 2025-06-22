from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .google_oauth import GoogleOAuthService
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """Logowanie przez Google OAuth"""
    access_token = request.data.get('access_token')
    
    if not access_token:
        return Response(
            {'error': 'Access token is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    google_service = GoogleOAuthService()
    user_info = google_service.get_user_info(access_token)
    
    if not user_info:
        return Response(
            {'error': 'Invalid Google token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    email = user_info.get('email')
    if not email:
        return Response(
            {'error': 'Email not provided by Google'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Sprawdź czy użytkownik już istnieje
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Utwórz nowego użytkownika
        user = User.objects.create_user(
            email=email,
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', ''),
            is_active=True
        )
        logger.info(f"Created new user via Google OAuth: {email}")
    
    # Wygeneruj JWT token
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)
