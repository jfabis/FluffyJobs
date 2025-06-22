import React from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleOneTap = ({ onSuccess, onError, disabled = false }) => {
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (disabled) return;
      
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        console.log('One-tap user info:', decoded);

        const response = await fetch('http://127.0.0.1:8000/api/auth/google/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
            client_id: credentialResponse.clientId
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('user_info', JSON.stringify(data.user));
          
          onSuccess(data);
        } else {
          onError(data.error || 'One-tap login failed');
        }
      } catch (error) {
        console.error('One-tap login error:', error);
        onError('Network error during one-tap login');
      }
    },
    onError: () => {
      console.log('One-tap login failed');
      onError('One-tap login failed');
    },
    disabled: disabled,
    auto_select: true, // Automatycznie wybierz użytkownika jeśli ma jedną sesję
    cancel_on_tap_outside: false // Nie zamykaj przy kliknięciu poza prompt
  });

  return null; // One-tap nie renderuje żadnego UI
};

export default GoogleOneTap;
