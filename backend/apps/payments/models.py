from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Tutaj możesz dodać modele płatności
# class Payment(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     created_at = models.DateTimeField(auto_now_add=True)
