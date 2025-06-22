import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log('PublicRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Jeśli zalogowany, przekieruj do dashboard
  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Jeśli nie zalogowany, pokaż stronę logowania
  return <Outlet />;
};

export default PublicRoute;
