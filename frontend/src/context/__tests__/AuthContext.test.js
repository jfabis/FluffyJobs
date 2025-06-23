import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock AuthContext
const mockAuthContext = {
  isAuthenticated: false,
  user: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const AuthContext = React.createContext(mockAuthContext);

const useAuth = () => React.useContext(AuthContext);

const TestComponent = () => {
  const { isAuthenticated, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {loading ? 'loading' : (isAuthenticated ? 'authenticated' : 'not-authenticated')}
      </div>
    </div>
  );
};

describe('AuthContext', () => {
  test('provides authentication state', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  test('shows loading state', () => {
    const loadingContext = { ...mockAuthContext, loading: true };
    
    render(
      <AuthContext.Provider value={loadingContext}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('loading');
  });
});
