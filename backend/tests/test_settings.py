from django.test import TestCase
from django.conf import settings
import os

class SettingsTest(TestCase):
    def test_debug_setting(self):
        """Test czy DEBUG jest poprawnie skonfigurowane"""
        # W testach DEBUG może być True lub False
        self.assertIsInstance(settings.DEBUG, bool)

    def test_secret_key_exists(self):
        """Test czy SECRET_KEY jest ustawiony"""
        self.assertTrue(hasattr(settings, 'SECRET_KEY'))
        self.assertIsNotNone(settings.SECRET_KEY)
        self.assertGreater(len(settings.SECRET_KEY), 0)

    def test_installed_apps_contains_required(self):
        """Test czy wymagane aplikacje są zainstalowane"""
        required_apps = [
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'rest_framework'
        ]
        for app in required_apps:
            self.assertIn(app, settings.INSTALLED_APPS)
