import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  Work,
  Bookmark,
  TrendingUp,
  Notifications,
  Person,
  Payment,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  // Inteligentne pobieranie nazwy użytkownika
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Sprawdź różne możliwe pola nazwy
    if (user.displayName) return user.displayName;
    if (user.name) return user.name;
    if (user.full_name) return user.full_name;
    if (user.first_name && user.last_name) {
      return user.first_name + ' ' + user.last_name;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    
    return 'User';
  };

  const stats = [
    { icon: <Work />, value: '12', label: 'Applications Sent', color: '#1976d2' },
    { icon: <Bookmark />, value: '8', label: 'Saved Jobs', color: '#388e3c' },
    { icon: <TrendingUp />, value: '3', label: 'Interview Invites', color: '#f57c00' },
    { icon: <Notifications />, value: '5', label: 'New Messages', color: '#d32f2f' },
  ];

  const recentActivity = [
    { action: 'Applied to Senior React Developer at TechCorp', time: '2 hours ago' },
    { action: 'Saved UX Designer position at Design Studio', time: '1 day ago' },
    { action: 'Updated profile information', time: '3 days ago' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {getUserDisplayName()}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Here's what's happening with your job search
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: stat.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {React.cloneElement(stat.icon, { fontSize: 'large' })}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Work />}
                  component={Link}
                  to="/jobs"
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Browse Jobs
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  component={Link}
                  to="/profile"
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Bookmark />}
                  component={Link}
                  to="/saved-jobs"
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  View Saved Jobs
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Payment />}
                  component={Link}
                  to="/post-job"
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Post a Job
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Box>
              {recentActivity.map((activity, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < recentActivity.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
