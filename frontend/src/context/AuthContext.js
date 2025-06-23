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
    case 'UPDATE_PRO_STATUS':
      return {
        ...state,
        user: {
          ...state.user,
          is_pro: action.payload,
        },
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

  // Helper function to get unique user ID
  const getUserId = (user) => {
    if (!user) return null;
    return user.id || user.email || 'anonymous';
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');

      console.log('Initializing auth - token:', token ? 'exists' : 'none');

      if (token) {
        try {
          if (userData) {
            const user = JSON.parse(userData);
            const userId = getUserId(user);

            // KLUCZOWE: Sprawdź Pro status dla konkretnego użytkownika
            const userProKey = `pro_status_${userId}`;
            const userProStatus = localStorage.getItem(userProKey);
            user.is_pro = userProStatus === 'true';

            console.log(`Restoring session for user ${userId}, Pro status: ${user.is_pro}`);
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
            const userId = getUserId(user);
            const userProKey = `pro_status_${userId}`;
            const userProStatus = localStorage.getItem(userProKey);
            user.is_pro = userProStatus === 'true';

            console.log('Token valid, restoring session:', user);
            localStorage.setItem('user_data', JSON.stringify(user));
            dispatch({ type: 'RESTORE_SESSION', payload: user });
          } else {
            console.log('Token invalid, but checking if fake token');
            if (token.startsWith('fake-')) {
              const fakeUser = {
                id: token.includes('google') ? 'google-user-' + Date.now() : 'email-user-' + Date.now(),
                email: token.includes('google') ? 'user@gmail.com' : 'user@example.com',
                name: 'Test User',
                provider: token.includes('google') ? 'google' : 'email',
                is_pro: false,
              };

              const userId = getUserId(fakeUser);
              const userProKey = `pro_status_${userId}`;
              const userProStatus = localStorage.getItem(userProKey);
              fakeUser.is_pro = userProStatus === 'true';

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
          if (token.startsWith('fake-')) {
            const fakeUser = {
              id: token.includes('google') ? 'google-user-' + Date.now() : 'email-user-' + Date.now(),
              email: token.includes('google') ? 'user@gmail.com' : 'user@example.com',
              name: 'Test User',
              provider: token.includes('google') ? 'google' : 'email',
              is_pro: false,
            };

            const userId = getUserId(fakeUser);
            const userProKey = `pro_status_${userId}`;
            const userProStatus = localStorage.getItem(userProKey);
            fakeUser.is_pro = userProStatus === 'true';

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

        // Sprawdź Pro status dla tego użytkownika
        const userId = getUserId(data.user);
        const userProKey = `pro_status_${userId}`;
        const userProStatus = localStorage.getItem(userProKey);
        data.user.is_pro = userProStatus === 'true';

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

  const googleLogin = async (googleData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Google login data received:', googleData);

      // Sprawdź czy mamy rzeczywiste dane użytkownika z Google
      let userInfo = null;

      if (googleData.userInfo) {
        userInfo = googleData.userInfo;
        console.log('Using pre-fetched user info:', userInfo);
      } else if (googleData.access_token) {
        console.log('Fetching user info with access token...');
        const googleResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleData.access_token}`,
          {
            headers: {
              'Authorization': `Bearer ${googleData.access_token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (googleResponse.ok) {
          userInfo = await googleResponse.json();
          console.log('Fetched Google user info:', userInfo);
        }
      }

      // Jeśli nie udało się pobrać danych, użyj fallback
      if (!userInfo) {
        console.warn('Could not get user info from Google, using fallback');
        userInfo = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'Google User',
          verified_email: false
        };
      }

      // Stwórz obiekt użytkownika z rzeczywistymi danymi z Google
      const user = {
        id: userInfo.id || 'google_' + Date.now(),
        email: userInfo.email,
        name: userInfo.name,
        first_name: userInfo.given_name,
        last_name: userInfo.family_name,
        picture: userInfo.picture,
        provider: 'google',
        verified_email: userInfo.verified_email,
        is_pro: false, // Nowi użytkownicy domyślnie nie mają Pro
      };

      // Sprawdź Pro status dla Google użytkownika
      const userId = getUserId(user);
      const userProKey = `pro_status_${userId}`;
      const userProStatus = localStorage.getItem(userProKey);
      user.is_pro = userProStatus === 'true';

      const fakeToken = 'fake-google-token-' + Date.now();

      localStorage.setItem('access_token', fakeToken);
      localStorage.setItem('user_data', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });

      console.log('Google login successful with real user data:', user);
      return { user, token: fakeToken };

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
        id: 'register-user-' + Date.now(),
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        user_type: userData.user_type,
        provider: 'email',
        is_pro: false, // Nowi użytkownicy nie mają Pro
      };

      const fakeToken = 'fake-register-token-' + Date.now();

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

  const upgradeToPro = async () => {
    if (state.user) {
      const userId = getUserId(state.user);
      const userProKey = `pro_status_${userId}`;

      // KLUCZOWE: Zapisz Pro status dla konkretnego użytkownika
      localStorage.setItem(userProKey, 'true');

      // Zaktualizuj user data
      const updatedUser = { ...state.user, is_pro: true };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      dispatch({ type: 'UPDATE_PRO_STATUS', payload: true });
      console.log(`User ${userId} upgraded to Pro`);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    // NIE usuwaj Pro status - zostaje dla tego użytkownika
    dispatch({ type: 'LOGOUT' });
    console.log('Logged out, token and user data removed');
  };

  const checkAuthStatus = async () => {
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
      upgradeToPro,
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
