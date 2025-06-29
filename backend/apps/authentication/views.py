from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import EmailLoginSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request data: {request.data}")
    logger.info(f"Content type: {request.content_type}")
    # USUŃ tę linię: logger.info(f"Request body: {request.body}")
    
    try:
        serializer = EmailLoginSerializer(data=request.data)
        if serializer.is_valid():
            logger.info("Serializer is valid")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response({
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Exception in login_user: {str(e)}")
        return Response({
            'error': 'Server error',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
