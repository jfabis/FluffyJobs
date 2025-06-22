import stripe
from django.conf import settings
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

# ZAWSZE używaj testowych kluczy
stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeTestService:
    def __init__(self):
        self.publishable_key = settings.STRIPE_PUBLISHABLE_KEY
        # Sprawdź czy klucze są testowe
        if not self.publishable_key.startswith('pk_test_'):
            raise ValueError("BŁĄD: Używaj tylko testowych kluczy Stripe!")
        if not stripe.api_key.startswith('sk_test_'):
            raise ValueError("BŁĄD: Używaj tylko testowych kluczy Stripe!")
        
        logger.info("🧪 Stripe działa w trybie TESTOWYM")
    
    def create_test_payment_intent(
        self, 
        amount: int, 
        currency: str = "pln",
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        try:
            # Dodaj informację że to test
            test_metadata = metadata or {}
            test_metadata.update({
                "test_mode": "true",
                "environment": "development",
                "note": "To jest płatność testowa - żadne prawdziwe pieniądze nie są przelewane"
            })
            
            intent = stripe.PaymentIntent.create(
                amount=amount,  # kwota w groszach
                currency=currency,
                metadata=test_metadata,
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            
            logger.info(f"🧪 Utworzono testowy Payment Intent: {intent.id}")
            
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
                "amount": intent.amount,
                "currency": intent.currency,
                "test_mode": True,
                "warning": "To jest płatność testowa!"
            }
        except stripe.error.StripeError as e:
            logger.error(f"Błąd testowego Stripe: {str(e)}")
            raise Exception(f"Błąd testowego Stripe: {str(e)}")
    
    def get_test_cards(self) -> Dict[str, str]:
        return {
            "visa_success": "4242424242424242",
            "visa_declined": "4000000000000002", 
            "mastercard_success": "5555555555554444",
            "amex_success": "378282246310005",
            "visa_3d_secure": "4000000000003220"
        }
