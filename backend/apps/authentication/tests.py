from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.test import APIClient

class AuthenticationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_authentication(self):
        """Test autentykacji użytkownika"""
        user = authenticate(username='testuser', password='testpass123')
        self.assertIsNotNone(user)
        self.assertEqual(user.username, 'testuser')

    def test_invalid_authentication(self):
        """Test nieprawidłowej autentykacji"""
        user = authenticate(username='testuser', password='wrongpass')
        self.assertIsNone(user)
