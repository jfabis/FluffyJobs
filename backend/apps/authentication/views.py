from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """Profesjonalne logowanie przez Google OAuth"""
    token = request.data.get('credential')
    
    if not token:
        return Response(
            {'error': 'Google credential token is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Weryfikuj token Google
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
        # Sprawdź czy token jest z właściwej domeny
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        # Pobierz dane użytkownika z Google
        google_id = idinfo['sub']
        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture', '')
        
        # Sprawdź czy użytkownik już istnieje
        try:
            user = User.objects.get(email=email)
            logger.info(f"Existing user logged in: {email}")
        except User.DoesNotExist:
            # Utwórz nowego użytkownika
            user = User.objects.create_user(
                email=email,
                first_name=first_name,
                last_name=last_name,
                is_active=True
            )
            # Zapisz Google ID w profilu użytkownika (opcjonalnie)
            # user.profile.google_id = google_id
            # user.profile.picture = picture
            # user.profile.save()
            
            logger.info(f"New user created via Google OAuth: {email}")
        
        # Wygeneruj JWT tokeny
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'picture': picture,
                'is_google_user': True
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        logger.error(f"Google token verification failed: {str(e)}")
        return Response(
            {'error': 'Invalid Google token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Google authentication error: {str(e)}")
        return Response(
            {'error': 'Authentication failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )