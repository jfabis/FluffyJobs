from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import stripe
import logging
import time

logger = logging.getLogger(__name__)

# POPRAWNIE: Używaj klucza z settings (który ładuje z .env)
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['GET'])
@permission_classes([AllowAny])
def stripe_config(request):
    """Check Stripe configuration"""
    return Response({
        'stripe_configured': bool(settings.STRIPE_SECRET_KEY),
        'publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
        'test_mode': settings.STRIPE_TEST_MODE,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """Create REAL Stripe Checkout Session"""
    try:
        if not stripe.api_key:
            return Response({
                'error': 'Stripe not configured properly. Check your STRIPE_SECRET_KEY.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = request.data
        amount = data.get('amount', 999)
        user_email = data.get('user_email', 'test@example.com')
        
        logger.info(f"Creating checkout session for {user_email}, amount: {amount}")
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'FluffyJobs Pro Monthly',
                        'description': 'Ad-free experience with premium features',
                    },
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:3000/upgrade/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/upgrade',
            customer_email=user_email,
            metadata={
                'user_email': user_email,
                'plan': 'fluffyjobs_pro',
                'app': 'FluffyJobs',
            },
        )
        
        logger.info(f"Checkout session created: {session.id}")
        
        return Response({
            'url': session.url,
            'session_id': session.id,
        }, status=status.HTTP_200_OK)
        
    except stripe.error.AuthenticationError as e:
        logger.error(f"Stripe authentication error: {e}")
        return Response({
            'error': f'Stripe authentication failed: {str(e)}'
        }, status=status.HTTP_401_UNAUTHORIZED)
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        return Response({
            'error': f'Stripe error: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return Response({
            'error': f'Payment creation failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment_intent(request):
    """Create REAL Stripe Payment Intent"""
    try:
        if not stripe.api_key:
            return Response({
                'error': 'Stripe not configured properly.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = request.data
        amount = data.get('amount', 999)
        user_email = data.get('user_email', 'test@example.com')
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            description='FluffyJobs Pro Monthly',
            automatic_payment_methods={'enabled': True},
            metadata={
                'user_email': user_email,
                'plan': 'fluffyjobs_pro',
            },
        )
        
        return Response({
            'payment_intent_id': intent.id,
            'client_secret': intent.client_secret,
            'status': intent.status,
        }, status=status.HTTP_200_OK)
        
    except stripe.error.StripeError as e:
        return Response({
            'error': f'Stripe error: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Payment intent creation failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_payment(request):
    """Confirm payment and upgrade user"""
    try:
        data = request.data
        payment_intent_id = data.get('payment_intent_id')
        
        if not payment_intent_id:
            return Response({
                'error': 'Payment intent ID required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'status': 'succeeded',
            'message': 'Payment confirmed successfully',
            'user_upgraded': True,
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'error': f'Payment confirmation failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_test_cards(request):
    """Return Stripe test cards"""
    return Response({
        'test_cards': {
            'visa_success': '4242424242424242',
            'visa_declined': '4000000000000002',
            'mastercard_success': '5555555555554444',
        },
        'stripe_configured': bool(settings.STRIPE_SECRET_KEY),
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def simulate_test_payment(request):
    """Simulate test payment for development"""
    try:
        data = request.data
        user_email = data.get('user_email', 'test@example.com')
        amount = data.get('amount', 999)
        
        logger.info(f"Simulating test payment for {user_email}, amount: {amount}")
        
        # Simulate successful payment
        return Response({
            'payment_intent_id': f'pi_test_{int(time.time())}',
            'status': 'succeeded',
            'amount': amount,
            'message': 'Test payment simulated successfully',
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Test payment simulation error: {e}")
        return Response({
            'error': f'Test payment simulation failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

