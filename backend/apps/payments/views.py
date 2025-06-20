from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    return Response({'message': 'Payment functionality coming soon'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    return Response({'message': 'Payment verification coming soon'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def offline_payment_approval(request):
    return Response({'message': 'Offline approval coming soon'})
