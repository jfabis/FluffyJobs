import React, { useState, useEffect, createContext, useContext } from 'react';

// Utwórz context z undefined jako default
const AuthContext = createContext(undefined);

// Hook useAuth z dokładnym sprawdzaniem
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Sprawdź czy context jest undefined (nie ma Provider)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('🔧 AuthProvider rendered'); // Debug log

  useEffect(() => {
    console.log('🔧 AuthProvider useEffect triggered'); // Debug log
    
    // Sprawdź czy użytkownik jest zalogowany przy ładowaniu aplikacji
    const token = localStorage.getItem('access_token');
    const userInfo = localStorage.getItem('user_info');

    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ User restored from localStorage:', parsedUser);
      } catch (error) {
        console.error('❌ Error parsing user info:', error);
        // Wyczyść nieprawidłowe dane
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
      }
    }
    
    setLoading(false);
    console.log('✅ AuthProvider initialization complete');
  }, []);

  const login = (userData) => {
    console.log('🔐 Login called with:', userData);
    setUser(userData.user);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', userData.access_token);
    localStorage.setItem('refresh_token', userData.refresh_token);
    localStorage.setItem('user_info', JSON.stringify(userData.user));
  };

  const logout = () => {
    console.log('🚪 Logout called');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  };

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getAuthToken
  };

  console.log('🔧 AuthProvider value:', { isAuthenticated, loading, userExists: !!user });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
