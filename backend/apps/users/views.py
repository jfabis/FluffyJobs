from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
import logging
import json

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print(f"=== REGISTRATION DEBUG START ===")
    print(f"Request method: {request.method}")
    print(f"Request content type: {request.content_type}")
    print(f"Request data: {request.data}")
    print(f"Request data type: {type(request.data)}")
    
    # Sprawdź czy dane są poprawne
    for key, value in request.data.items():
        print(f"  {key}: {value} (type: {type(value)})")
    
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        print(f"Serializer created successfully")
        
        # Sprawdź walidację krok po kroku
        print(f"Checking serializer validity...")
        is_valid = serializer.is_valid()
        print(f"Serializer is_valid: {is_valid}")
        
        if is_valid:
            print("Serializer is valid, attempting to save...")
            user = serializer.save()
            print(f"User saved successfully: {user.email} (ID: {user.id})")
            
            refresh = RefreshToken.for_user(user)
            response_data = {
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Konto zostało utworzone pomyślnie.'
            }
            print(f"Returning success response")
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print(f"=== SERIALIZER VALIDATION ERRORS ===")
            print(f"Errors: {serializer.errors}")
            print(f"Error details:")
            for field, errors in serializer.errors.items():
                print(f"  Field '{field}': {errors}")
            
            return Response({
                'success': False,
                'errors': serializer.errors,
                'message': 'Błąd walidacji danych rejestracji',
                'debug_info': {
                    'received_data': dict(request.data),
                    'serializer_errors': dict(serializer.errors)
                }
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"=== EXCEPTION DURING REGISTRATION ===")
        print(f"Exception type: {type(e)}")
        print(f"Exception message: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return Response({
            'success': False,
            'error': 'Server error during registration',
            'details': str(e),
            'type': str(type(e))
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    finally:
        print(f"=== REGISTRATION DEBUG END ===")

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Logowanie zakończone sukcesem.'
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'errors': serializer.errors,
            'message': 'Błąd logowania'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Wylogowano pomyślnie.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Błąd podczas wylogowywania.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
