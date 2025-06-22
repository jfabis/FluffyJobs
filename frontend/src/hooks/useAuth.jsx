import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Zaczynamy z loading=true

  useEffect(() => {
    // Sprawdź localStorage przy inicjalizacji
    const checkAuthState = () => {
      const token = localStorage.getItem('access_token');
      const userInfo = localStorage.getItem('user_info');

      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Wyczyść nieprawidłowe dane
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_info');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      // WAŻNE: Ustaw loading na false dopiero po sprawdzeniu
      setLoading(false);
    };

    checkAuthState();
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', userData.access_token);
    localStorage.setItem('refresh_token', userData.refresh_token);
    localStorage.setItem('user_info', JSON.stringify(userData.user));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  };

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};