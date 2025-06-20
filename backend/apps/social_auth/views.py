from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    return Response({'message': 'Google login coming soon'})

@api_view(['POST'])
@permission_classes([AllowAny])
def github_login(request):
    return Response({'message': 'GitHub login coming soon'})
