from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .stripe_test_service import StripeTestService
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_test_payment_intent(request):
    amount = request.data.get('amount')
    currency = request.data.get('currency', 'pln')
    job_id = request.data.get('job_id')
    
    if not amount:
        return Response(
            {'error': 'Amount is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        amount_cents = int(float(amount) * 100)
        
        stripe_service = StripeTestService()
        result = stripe_service.create_test_payment_intent(
            amount=amount_cents,
            currency=currency,
            metadata={
                "user_id": str(request.user.id),
                "job_id": str(job_id) if job_id else None,
                "user_email": request.user.email,
                "test_payment": "true"
            }
        )
        
        # Dodaj informacje o testowych kartach
        result['test_cards'] = stripe_service.get_test_cards()
        result['instructions'] = "Użyj testowych numerów kart. Żadne prawdziwe pieniądze nie będą pobrane!"
        
        logger.info(f"🧪 Testowy payment intent utworzony dla użytkownika {request.user.email}")
        
        return Response(result, status=status.HTTP_200_OK)
        
    except ValueError:
        return Response(
            {'error': 'Invalid amount format'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Błąd testowej płatności: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_test_cards(request):
    stripe_service = StripeTestService()
    test_cards = stripe_service.get_test_cards()
    
    return Response({
        'test_cards': test_cards,
        'instructions': {
            'visa_success': 'Płatność przejdzie pomyślnie',
            'visa_declined': 'Płatność zostanie odrzucona',
            'mastercard_success': 'Płatność Mastercard przejdzie pomyślnie',
            'amex_success': 'Płatność American Express przejdzie pomyślnie',
            'visa_3d_secure': 'Wymaga autoryzacji 3D Secure'
        },
        'expiry_date': 'Użyj dowolnej przyszłej daty (np. 12/25)',
        'cvc': 'Użyj dowolnego 3-cyfrowego kodu (np. 123)',
        'warning': '⚠️ To są TYLKO testowe karty! Nie używaj prawdziwych danych karty!'
    }, status=status.HTTP_200_OK)
