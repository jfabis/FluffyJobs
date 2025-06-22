import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginComponent = ({ onSuccess, onError }) => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Dekoduj JWT token od Google
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google user info:', decoded);

      // Wyślij token do Django backend
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
        // Zapisz token w localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
        
        console.log('Login successful:', data);
        onSuccess(data);
      } else {
        console.error('Backend login failed:', data);
        onError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      onError('Network error during Google login');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    onError('Google login failed');
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleLoginComponent;
