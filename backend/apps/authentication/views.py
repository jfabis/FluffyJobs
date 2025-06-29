from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Logowanie uzytkownika przez email/haslo"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email i haslo sa wymagane'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                if not user.is_active:
                    return Response({
                        'error': 'Konto uzytkownika jest nieaktywne'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'name': f'{user.first_name} {user.last_name}'.strip() or user.email,
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Nieprawidlowy email lub haslo'
                }, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                'error': 'Nieprawidlowy email lub haslo'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f'Login error: {str(e)}')
        return Response({
            'error': 'Server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """Logowanie przez Google OAuth"""
    logger.info(f'Google auth request received: {request.data}')
    
    access_token = request.data.get('access_token')
    
    if not access_token:
        logger.error('No access token provided')
        return Response({'error': 'Access token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Pobierz dane uzytkownika z Google API
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            logger.error(f'Google API error: {response.status_code}')
            return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_info = response.json()
        logger.info(f'Google user info received: {user_info}')
        
        email = user_info.get('email')
        if not email:
            logger.error('No email in Google user info')
            return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Sprawdz czy uzytkownik juz istnieje
        try:
            user = User.objects.get(email=email)
            logger.info(f'Existing user found: {email}')
        except User.DoesNotExist:
            # Utworz nowego uzytkownika
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
        
        # Przygotuj pelne dane uzytkownika
        response_data = {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'name': user_info.get('name', f'{user.first_name} {user.last_name}'.strip() or user.email),
                'picture': user_info.get('picture', ''),
                'username': user.username,
                'is_premium': getattr(user, 'is_premium', False),
                'user_type': getattr(user, 'usertype', 'jobseeker'),
                'google_data': {
                    'picture': user_info.get('picture', ''),
                    'verified_email': user_info.get('verified_email', False),
                    'locale': user_info.get('locale', 'en'),
                }
            }
        }
        
        logger.info(f'Sending complete user data for: {email}')
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f'Google auth error: {str(e)}')
        return Response({'error': f'Google auth failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
