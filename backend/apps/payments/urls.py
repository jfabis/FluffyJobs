from django.urls import path
from . import views

urlpatterns = [
    path('create-test-payment-intent/', views.create_test_payment_intent, name='create_test_payment_intent'),
    path('test-cards/', views.get_test_cards, name='get_test_cards'),
]
