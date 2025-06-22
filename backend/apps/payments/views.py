from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_test_payment_intent(request):
    """Tworzy testowy Payment Intent - placeholder"""
    return Response({
        'message': 'Test payment intent endpoint - do implementacji',
        'status': 'placeholder'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_test_cards(request):
    """Zwraca testowe karty Stripe"""
    return Response({
        'test_cards': {
            'visa_success': '4242424242424242',
            'visa_declined': '4000000000000002',
            'mastercard_success': '5555555555554444',
        },
        'instructions': {
            'visa_success': 'Płatność przejdzie pomyślnie',
            'visa_declined': 'Płatność zostanie odrzucona',
            'mastercard_success': 'Płatność Mastercard przejdzie pomyślnie',
        },
        'expiry_date': 'Użyj dowolnej przyszłej daty (np. 12/25)',
        'cvc': 'Użyj dowolnego 3-cyfrowego kodu (np. 123)',
        'warning': '⚠️ To są TYLKO testowe karty! Nie używaj prawdziwych danych karty!'
    }, status=status.HTTP_200_OK)
