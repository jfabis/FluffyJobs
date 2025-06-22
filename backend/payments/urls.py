from django.urls import path
from . import test_views

urlpatterns = [
    path('create-test-payment-intent/', test_views.create_test_payment_intent, name='create_test_payment_intent'),
    path('test-cards/', test_views.get_test_cards, name='get_test_cards'),
]
