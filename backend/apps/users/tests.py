from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class UserModelTest(TestCase):
    def test_user_creation(self):
        """Test tworzenia użytkownika"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
