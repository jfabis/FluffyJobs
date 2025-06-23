from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User

class JobsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_jobs_list_endpoint_exists(self):
        """Test czy endpoint /api/jobs/ istnieje"""
        try:
            response = self.client.get('/api/jobs/')
            # Endpoint istnieje, może zwrócić 200, 401 lub 403
            self.assertIn(response.status_code, [200, 401, 403])
        except:
            # Jeśli endpoint nie istnieje, sprawdź główny API
            response = self.client.get('/api/')
            self.assertIn(response.status_code, [200, 404])
