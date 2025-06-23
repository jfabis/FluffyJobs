from django.urls import path
from . import views

urlpatterns = [
    path('config/', views.stripe_config, name='stripe_config'),
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
    path('create-payment-intent/', views.create_payment_intent, name='create_payment_intent'),
    path('confirm-payment/', views.confirm_payment, name='confirm_payment'),
    path('simulate-test-payment/', views.simulate_test_payment, name='simulate_test_payment'),
    path('test-cards/', views.get_test_cards, name='get_test_cards'),
]
