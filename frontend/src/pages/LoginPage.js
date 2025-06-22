import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [message, setMessage] = useState('');
  const { login, isAuthenticated, loading } = useAuth();

  console.log('📄 LoginPage rendered - isAuthenticated:', isAuthenticated, 'loading:', loading);

  const handleTestLogin = () => {
    const testUserData = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      user: {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      }
    };
    
    login(testUserData);
    setMessage('Testowe logowanie pomyślne!');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        🔄 Ładowanie...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1>🐾 FluffyJobs</h1>
        <h2>Strona logowania</h2>
        
        {message && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            ✅ {message}
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <p>Status: {isAuthenticated ? '✅ Zalogowany' : '❌ Niezalogowany'}</p>
        </div>
        
        <button
          onClick={handleTestLogin}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          🧪 Testowe logowanie
        </button>
      </div>
    </div>
  );
};

export default LoginPage;