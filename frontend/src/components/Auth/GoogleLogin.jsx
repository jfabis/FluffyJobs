import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = ({ onSuccess, onError, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (disabled) return;
    
    setLoading(true);
    
    try {
      console.log('Google credential received:', credentialResponse);

      // Sprawdź czy backend działa
      const response = await fetch('http://127.0.0.1:8000/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend authentication successful:', data);
      onSuccess(data);
      
    } catch (error) {
      console.error('Google authentication error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        onError('Nie można połączyć się z serwerem. Sprawdź czy backend Django działa.');
      } else if (error.message.includes('Backend error: 400')) {
        onError('Nieprawidłowy token Google. Spróbuj ponownie.');
      } else if (error.message.includes('Backend error: 500')) {
        onError('Błąd serwera. Sprawdź konfigurację Google OAuth w backend.');
      } else {
        onError('Błąd podczas logowania przez Google. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
    setLoading(false);
    
    if (error?.error === 'popup_closed_by_user') {
      onError('Logowanie zostało anulowane.');
    } else if (error?.error === 'access_denied') {
      onError('Dostęp został odrzucony. Sprawdź uprawnienia aplikacji.');
    } else {
      onError('Błąd logowania Google. Sprawdź konfigurację aplikacji.');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
        disabled={disabled || loading}
        useOneTap={false}
        auto_select={false}
      />
      {loading && (
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '14px',
          color: '#666'
        }}>
          🔄 Authenticating with Google...
        </div>
      )}
    </div>
  );
};

export default GoogleLoginComponent;