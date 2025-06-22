from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .stripe_service import StripeService
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Tworzy Payment Intent dla płatności Stripe"""
    amount = request.data.get('amount')
    currency = request.data.get('currency', 'pln')
    job_id = request.data.get('job_id')
    
    if not amount:
        return Response(
            {'error': 'Amount is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        amount_cents = int(float(amount) * 100)  # konwersja na grosze
        
        stripe_service = StripeService()
        result = stripe_service.create_payment_intent(
            amount=amount_cents,
            currency=currency,
            metadata={
                "user_id": str(request.user.id),
                "job_id": str(job_id) if job_id else None,
                "user_email": request.user.email
            }
        )
        
        return Response(result, status=status.HTTP_200_OK)
        
    except ValueError:
        return Response(
            {'error': 'Invalid amount format'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Payment intent creation error: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    """Potwierdza płatność"""
    payment_intent_id = request.data.get('payment_intent_id')
    
    if not payment_intent_id:
        return Response(
            {'error': 'Payment intent ID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    stripe_service = StripeService()
    is_confirmed = stripe_service.confirm_payment(payment_intent_id)
    
    if is_confirmed:
        # Tutaj możesz dodać logikę biznesową po udanej płatności
        # np. aktywacja ogłoszenia, wysłanie emaila, etc.
        return Response(
            {'message': 'Payment confirmed successfully'}, 
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'error': 'Payment confirmation failed'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, payment_intent_id):
    """Pobiera status płatności"""
    stripe_service = StripeService()
    status_result = stripe_service.get_payment_status(payment_intent_id)
    
    return Response({
        'payment_intent_id': payment_intent_id,
        'status': status_result
    }, status=status.HTTP_200_OK)
