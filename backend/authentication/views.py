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
    logger.info(f'Google auth request received: {request.data}')
    
    access_token = request.data.get('access_token')
    
    if not access_token:
        logger.error('No access token provided')
        return Response({'error': 'Access token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    google_service = GoogleOAuthService()
    user_info = google_service.get_user_info(access_token)
    
    logger.info(f'Google user info received: {user_info}')
    
    if not user_info:
        logger.error('Failed to get user info from Google')
        return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
    
    email = user_info.get('email')
    if not email:
        logger.error('No email in Google user info')
        return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # SprawdŸ czy u¿ytkownik ju¿ istnieje
        user = User.objects.get(email=email)
        logger.info(f'Existing user found: {email}')
    except User.DoesNotExist:
        # Utwórz nowego u¿ytkownika
        user = User.objects.create_user(
            email=email,
            username=email,
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', ''),
            is_active=True
        )
        logger.info(f'Created new user: {email}')
    
    # Wygeneruj JWT token
    refresh = RefreshToken.for_user(user)
    access_jwt = str(refresh.access_token)
    refresh_jwt = str(refresh)
    
    response_data = {
        'access_token': access_jwt,
        'refresh_token': refresh_jwt,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'name': f'{user.first_name} {user.last_name}'.strip() or user.email,
        }
    }
    
    logger.info(f'Sending response: access_token length={len(access_jwt)}, user_id={user.id}')
    
    return Response(response_data, status=status.HTTP_200_OK)
