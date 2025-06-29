from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    if not user.is_active:
                        raise serializers.ValidationError("Konto uzytkownika jest nieaktywne.")
                    
                    refresh = RefreshToken.for_user(user)
                    return {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': {
                            'id': user.id,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                        }
                    }
                else:
                    raise serializers.ValidationError("Nieprawidlowy email lub haslo.")
            except User.DoesNotExist:
                raise serializers.ValidationError("Nieprawidlowy email lub haslo.")
        else:
            raise serializers.ValidationError("Email i haslo sa wymagane.")
