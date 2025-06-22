import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      console.log('Initializing auth - token:', token ? 'exists' : 'none');
      console.log('Stored user data:', userData);
      
      if (token) {
        try {
          // Jeśli mamy zapisane dane użytkownika, użyj ich
          if (userData) {
            const user = JSON.parse(userData);
            console.log('Restoring session from localStorage:', user);
            dispatch({ type: 'RESTORE_SESSION', payload: user });
            return;
          }
          
          // Próbuj sprawdzić token w backend
          const response = await fetch('http://localhost:8000/api/auth/user/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const user = await response.json();
            console.log('Token valid, restoring session:', user);
            localStorage.setItem('user_data', JSON.stringify(user));
            dispatch({ type: 'RESTORE_SESSION', payload: user });
          } else {
            console.log('Token invalid, but checking if fake token');
            // Jeśli to fake token (z naszej symulacji), przywróć fake user
            if (token.startsWith('fake-')) {
              const fakeUser = {
                id: 1,
                email: 'user@example.com',
                name: 'Test User',
                provider: token.includes('google') ? 'google' : 'email'
              };
              console.log('Restoring fake user session:', fakeUser);
              localStorage.setItem('user_data', JSON.stringify(fakeUser));
              dispatch({ type: 'RESTORE_SESSION', payload: fakeUser });
            } else {
              console.log('Removing invalid token');
              localStorage.removeItem('access_token');
              localStorage.removeItem('user_data');
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // Jeśli błąd sieci, ale mamy fake token, przywróć sesję
          if (token.startsWith('fake-')) {
            const fakeUser = {
              id: 1,
              email: 'user@example.com',
              name: 'Test User',
              provider: token.includes('google') ? 'google' : 'email'
            };
            console.log('Network error, but restoring fake session:', fakeUser);
            localStorage.setItem('user_data', JSON.stringify(fakeUser));
            dispatch({ type: 'RESTORE_SESSION', payload: fakeUser });
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else {
        console.log('No token found, user not authenticated');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token || data.token;
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        console.log('Login successful, token and user data saved');
        return data;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const googleLogin = async (tokenResponse) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Google token response:', tokenResponse);
      
      const fakeUser = {
        id: 1,
        email: 'user@gmail.com',
        name: 'Google User',
        provider: 'google'
      };
      
      const fakeToken = 'fake-google-token-' + Date.now();
      
      // KLUCZOWE: Zapisz zarówno token jak i dane użytkownika
      localStorage.setItem('access_token', fakeToken);
      localStorage.setItem('user_data', JSON.stringify(fakeUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: fakeUser });
      
      console.log('Google login successful, token and user data saved');
      return { user: fakeUser, token: fakeToken };
      
    } catch (error) {
      console.error('Google login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Attempting registration:', userData);
      
      const fakeUser = {
        id: 2,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        user_type: userData.user_type,
        provider: 'email'
      };
      
      const fakeToken = 'fake-register-token-' + Date.now();
      
      // KLUCZOWE: Zapisz zarówno token jak i dane użytkownika
      localStorage.setItem('access_token', fakeToken);
      localStorage.setItem('user_data', JSON.stringify(fakeUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: fakeUser });
      
      console.log('Registration successful, token and user data saved');
      return { user: fakeUser, token: fakeToken };
      
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
    console.log('Logged out, token and user data removed');
  };

  const checkAuthStatus = async () => {
    // Ta funkcja jest już obsługiwana przez useEffect
    return state.isAuthenticated;
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      googleLogin,
      register,
      logout,
      checkAuthStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
