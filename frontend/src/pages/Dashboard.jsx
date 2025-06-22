import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a202c',
            margin: 0
          }}>
            🐾 FluffyJobs
          </h1>
          <span style={{
            backgroundColor: '#e6fffa',
            color: '#00695c',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            Dashboard
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {user?.picture && (
            <img
              src={user.picture}
              alt="Profile"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid #e2e8f0'
              }}
            />
          )}
          <span style={{ color: '#4a5568', fontSize: '14px' }}>
            {user?.first_name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#f56565',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Wyloguj
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Welcome Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              Witaj, {user?.first_name || 'Użytkowniku'}! 👋
            </h2>
            <p style={{
              color: '#718096',
              margin: 0
            }}>
              Gotowy na znalezienie wymarzonej pracy?
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #4299e1'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💼</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1a202c' }}>
                Dostępne oferty
              </h3>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#4299e1' }}>
                1,247
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #48bb78'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1a202c' }}>
                Twoje aplikacje
              </h3>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#48bb78' }}>
                0
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #ed8936'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1a202c' }}>
                Ulubione
              </h3>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ed8936' }}>
                0
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '16px'
            }}>
              Szybkie akcje
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <button style={{
                padding: '16px',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left'
              }}>
                🔍 Szukaj ofert pracy
              </button>
              
              <button style={{
                padding: '16px',
                backgroundColor: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left'
              }}>
                📄 Zaktualizuj CV
              </button>
              
              <button style={{
                padding: '16px',
                backgroundColor: '#ed8936',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left'
              }}>
                🔔 Ustawienia powiadomień
              </button>
            </div>
          </div>

          {/* User Info Debug */}
          <details style={{ marginTop: '24px' }}>
            <summary style={{
              cursor: 'pointer',
              padding: '12px',
              backgroundColor: '#f7fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              🔧 Informacje debugowania (kliknij aby rozwinąć)
            </summary>
            <pre style={{
              backgroundColor: '#1a202c',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              marginTop: '8px'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;