import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // SprawdŸ sessionStorage przy starcie
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = sessionStorage.getItem('user');
        const savedToken = sessionStorage.getItem('token');
        
        console.log('Checking auth on startup:', { savedUser: !!savedUser, savedToken: !!savedToken });
        
        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('User restored from sessionStorage:', userData.email);
        }
      } catch (error) {
        console.error('Error restoring auth:', error);
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access || data.access_token;
        
        // Zapisz do sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refresh_token', data.refresh || '');
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('Login successful, saved to sessionStorage');
        return data;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: googleData.access_token || googleData.accessToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Zapisz do sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('refresh_token', data.refresh_token || '');
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('Google login successful, saved to sessionStorage');
        return data;
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          password_confirm: userData.password,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          user_type: userData.usertype || 'jobseeker',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access || data.access_token;
        
        // Zapisz do sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refresh_token', data.refresh || '');
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('Registration successful, saved to sessionStorage');
        return data;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out, sessionStorage cleared');
  };

  const getUserDisplayName = (userData = user) => {
    if (!userData) return 'User';
    return userData.name || userData.first_name || userData.email?.split('@')[0] || 'User';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      googleLogin,
      register,
      logout,
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
