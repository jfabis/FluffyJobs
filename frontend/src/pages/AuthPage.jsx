import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginComponent from '../components/auth/GoogleLogin';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = (userData) => {
    setError('');
    setSuccess('Logowanie przez Google pomyślne! Przekierowywanie...');
    login(userData);
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
    setSuccess('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '8px'
          }}>
            🐾 FluffyJobs
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '16px'
          }}>
            {isLogin ? 'Zaloguj się do swojego konta' : 'Utwórz nowe konto'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fed7d7',
            color: '#c53030',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #feb2b2',
            fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#c6f6d5',
            color: '#2d7d32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #9ae6b4',
            fontSize: '14px'
          }}>
            ✅ {success}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <GoogleLoginComponent
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          color: '#a0aec0',
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <span style={{ padding: '0 16px' }}>lub</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#718096'
        }}>
          {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
          {' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4299e1',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;