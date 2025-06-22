import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#4285f4',
          color: 'white',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            🐾 FluffyJobs Dashboard
          </h1>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Wyloguj się
          </button>
        </div>

        {/* User Info */}
        <div style={{ padding: '30px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            {user?.picture && (
              <img
                src={user.picture}
                alt="Profile"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  marginRight: '20px',
                  border: '3px solid #4285f4'
                }}
              />
            )}
            <div>
              <h2 style={{ 
                margin: '0 0 5px 0',
                color: '#333',
                fontSize: '20px'
              }}>
                Witaj, {user?.first_name || user?.name || 'Użytkowniku'}! 👋
              </h2>
              <p style={{ 
                margin: 0,
                color: '#666',
                fontSize: '14px'
              }}>
                📧 {user?.email}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0',
                color: '#4285f4',
                fontSize: '16px'
              }}>
                👤 Informacje osobiste
              </h3>
              <p><strong>Imię:</strong> {user?.first_name || 'Nie podano'}</p>
              <p><strong>Nazwisko:</strong> {user?.last_name || 'Nie podano'}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <div style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0',
                color: '#34a853',
                fontSize: '16px'
              }}>
                🔐 Status konta
              </h3>
              <p><strong>ID użytkownika:</strong> {user?.id}</p>
              <p><strong>Typ logowania:</strong> Google OAuth</p>
              <p><strong>Status:</strong> ✅ Aktywny</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <button style={{
              padding: '15px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              💼 Przeglądaj oferty pracy
            </button>
            
            <button style={{
              padding: '15px',
              backgroundColor: '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ➕ Dodaj ofertę pracy
            </button>
            
            <button style={{
              padding: '15px',
              backgroundColor: '#fbbc05',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              💳 Testuj płatności
            </button>
          </div>

          {/* Debug Info */}
          <details style={{ marginTop: '30px' }}>
            <summary style={{ 
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              marginBottom: '10px'
            }}>
              🔧 Informacje debugowania (kliknij aby rozwinąć)
            </summary>
            <pre style={{
              backgroundColor: '#f8f8f8',
              padding: '15px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              border: '1px solid #e0e0e0'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
