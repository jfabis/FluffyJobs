import React from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  console.log('📄 LoginPage component rendered');
  
  // To powinno działać jeśli AuthProvider jest poprawnie skonfigurowany
  const { isAuthenticated, loading, login } = useAuth();
  
  console.log('🔧 LoginPage useAuth result:', { isAuthenticated, loading });

  const handleTestLogin = () => {
    console.log('🧪 Test login clicked');
    
    const testUserData = {
      access_token: 'test-token-123',
      refresh_token: 'test-refresh-123',
      user: {
        id: 1,
        email: 'test@fluffyjobs.com',
        first_name: 'Test',
        last_name: 'User'
      }
    };
    
    login(testUserData);
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
        <h1 style={{ marginBottom: '20px' }}>🐾 FluffyJobs</h1>
        
        <div style={{
          backgroundColor: isAuthenticated ? '#d4edda' : '#f8d7da',
          color: isAuthenticated ? '#155724' : '#721c24',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Status: {isAuthenticated ? '✅ Zalogowany' : '❌ Niezalogowany'}
        </div>
        
        {!isAuthenticated && (
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
        )}
        
        {isAuthenticated && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e7f3ff',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <p><strong>🎉 Logowanie działa!</strong></p>
            <p>useAuth hook jest poprawnie skonfigurowany</p>
          </div>
        )}
        
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Debug info:</strong><br/>
          Loading: {loading.toString()}<br/>
          Authenticated: {isAuthenticated.toString()}<br/>
          Timestamp: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
