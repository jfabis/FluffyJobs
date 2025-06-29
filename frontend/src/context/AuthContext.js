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

  const getUserId = (user) => {
    if (!user) return null;
    return user.id || user.email || 'anonymous';
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    
    // Sprawdź różne możliwe pola nazwy
    if (user.name) return user.name;
    if (user.full_name) return user.full_name;
    if (user.first_name && user.last_name) {
      return user.first_name + ' ' + user.last_name;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    if (user.email) return user.email.split('@')[0];
    
    return 'User';
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');

      console.log('Initializing auth - token exists:', !!token);

      if (token) {
        try {
          if (userData) {
            const user = JSON.parse(userData);
            const userId = getUserId(user);
            const userProKey = 'pro_status_' + userId;
            const userProStatus = localStorage.getItem(userProKey);
            user.is_pro = userProStatus === 'true';
            
            // Dodaj display name do user object
            user.displayName = getUserDisplayName(user);

            console.log('Restoring session for user:', getUserDisplayName(user));
            dispatch({ type: 'RESTORE_SESSION', payload: user });
            return;
          }

          dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          dispatch({ type: 'SET_LOADING', payload: false });
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
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access || data.access_token || data.token;

        const userId = getUserId(data.user);
        const userProKey = 'pro_status_' + userId;
        const userProStatus = localStorage.getItem(userProKey);
        data.user.is_pro = userProStatus === 'true';
        
        // Dodaj display name do user object
        data.user.displayName = getUserDisplayName(data.user);

        localStorage.setItem('access_token', token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        console.log('Login successful for:', getUserDisplayName(data.user));
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Attempting registration:', userData);

      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          password_confirm: userData.password,
          first_name: userData.firstName || userData.first_name || '',
          last_name: userData.lastName || userData.last_name || '',
          user_type: userData.user_type || 'job_seeker'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access || data.access_token || data.token;

        data.user.is_pro = false;
        
        // Dodaj display name do user object
        data.user.displayName = getUserDisplayName(data.user);

        localStorage.setItem('access_token', token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });

        console.log('Registration successful for:', getUserDisplayName(data.user));
        return { user: data.user, token: token };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const googleLogin = async (googleData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('Google login data received:', googleData);

      let userInfo = null;

      if (googleData.userInfo) {
        userInfo = googleData.userInfo;
      } else if (googleData.access_token) {
        const googleResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + googleData.access_token,
          {
            headers: {
              'Authorization': 'Bearer ' + googleData.access_token,
              'Accept': 'application/json'
            }
          }
        );

        if (googleResponse.ok) {
          userInfo = await googleResponse.json();
        }
      }

      if (!userInfo) {
        userInfo = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'Google User',
          verified_email: false
        };
      }

      const user = {
        id: userInfo.id || 'google_' + Date.now(),
        email: userInfo.email,
        name: userInfo.name,
        first_name: userInfo.given_name,
        last_name: userInfo.family_name,
        picture: userInfo.picture,
        provider: 'google',
        verified_email: userInfo.verified_email,
        is_pro: false,
      };

      const userId = getUserId(user);
      const userProKey = 'pro_status_' + userId;
      const userProStatus = localStorage.getItem(userProKey);
      user.is_pro = userProStatus === 'true';
      
      // Dodaj display name do user object
      user.displayName = getUserDisplayName(user);

      const fakeToken = 'fake-google-token-' + Date.now();

      localStorage.setItem('access_token', fakeToken);
      localStorage.setItem('user_data', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });

      console.log('Google login successful for:', getUserDisplayName(user));
      return { user, token: fakeToken };

    } catch (error) {
      console.error('Google login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const upgradeToPro = async () => {
    if (state.user) {
      const userId = getUserId(state.user);
      const userProKey = 'pro_status_' + userId;

      localStorage.setItem(userProKey, 'true');

      const updatedUser = { ...state.user, is_pro: true };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      dispatch({ type: 'UPDATE_PRO_STATUS', payload: true });
      console.log('User upgraded to Pro:', getUserDisplayName(updatedUser));
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
    console.log('Logged out');
  };

  const checkAuthStatus = async () => {
    return state.isAuthenticated;
  };

  // Dodaj helper function do value
  const getDisplayName = () => {
    return getUserDisplayName(state.user);
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
      getDisplayName,
      getUserDisplayName,
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
