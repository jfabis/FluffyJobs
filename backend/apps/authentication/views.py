from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """Logowanie przez Google OAuth - placeholder"""
    return Response({
        'message': 'Google OAuth endpoint - do implementacji',
        'status': 'placeholder'
    }, status=status.HTTP_200_OK)
