import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        Welcome, {user?.username}!
      </Typography>
    </Box>
  );
};

export default ProfilePage;
