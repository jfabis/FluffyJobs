import stripe
from django.conf import settings
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    def __init__(self):
        self.publishable_key = settings.STRIPE_PUBLISHABLE_KEY
    
    def create_payment_intent(
        self, 
        amount: int, 
        currency: str = "pln",
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Tworzy Payment Intent w Stripe"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,  # kwota w groszach
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
                "amount": intent.amount,
                "currency": intent.currency
            }
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            raise Exception(f"Stripe error: {str(e)}")
    
    def confirm_payment(self, payment_intent_id: str) -> bool:
        """Potwierdza płatność"""
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status == 'succeeded'
        except stripe.error.StripeError as e:
            logger.error(f"Payment confirmation error: {str(e)}")
            return False
    
    def get_payment_status(self, payment_intent_id: str) -> str:
        """Pobiera status płatności"""
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status
        except stripe.error.StripeError as e:
            logger.error(f"Payment status error: {str(e)}")
            return "unknown"
