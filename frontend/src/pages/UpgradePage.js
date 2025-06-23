import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Star,
  Check,
  Close,
  Speed,
  Security,
  Support,
  TrendingUp,
  Notifications,
  Analytics,
  CreditCard,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UpgradePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const proFeatures = [
    { icon: <Close />, text: 'No advertisements', color: 'success' },
    { icon: <Speed />, text: 'Faster job search', color: 'primary' },
    { icon: <Star />, text: 'Priority job applications', color: 'warning' },
    { icon: <Analytics />, text: 'Advanced analytics dashboard', color: 'info' },
    { icon: <Notifications />, text: 'Real-time job alerts', color: 'secondary' },
    { icon: <Support />, text: 'Premium customer support', color: 'success' },
    { icon: <Security />, text: 'Enhanced profile visibility', color: 'error' },
    { icon: <TrendingUp />, text: 'Salary insights & trends', color: 'primary' },
  ];

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/payments/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 999,
          user_email: user?.email || 'test@example.com',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      console.error('Stripe checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Upgrade to <span style={{ color: '#1976d2' }}>FluffyJobs Pro</span>
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Unlock premium features and enjoy an ad-free experience
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  Free
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  $0<span style={{ fontSize: '1rem', fontWeight: 400 }}>/month</span>
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon><Check color="success" /></ListItemIcon>
                  <ListItemText primary="Basic job search" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Check color="success" /></ListItemIcon>
                  <ListItemText primary="Apply to jobs" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Close color="error" /></ListItemIcon>
                  <ListItemText 
                    primary="Advertisements displayed" 
                    sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            elevation={8} 
            sx={{ 
              height: '100%',
              border: '3px solid #1976d2',
              position: 'relative',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: '#1976d2',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              MOST POPULAR
            </Box>
            
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                  Pro
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  $9.99<span style={{ fontSize: '1rem', fontWeight: 400 }}>/month</span>
                </Typography>
              </Box>
              
              <List>
                {proFeatures.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {React.cloneElement(feature.icon, { color: feature.color })}
                    </ListItemIcon>
                    <ListItemText primary={feature.text} />
                  </ListItem>
                ))}
              </List>

              {/* TYLKO JEDEN PRZYCISK - Stripe Checkout */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleStripeCheckout}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CreditCard />}
                sx={{
                  mt: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 3,
                }}
              >
                {loading ? 'Processing...' : 'Upgrade to Pro - $9.99/month'}
              </Button>
              
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, opacity: 0.7 }}>
                Secure payment powered by Stripe • Cancel anytime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Testimonials */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 600, mb: 4 }}>
          What Pro Users Say
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              name: 'Sarah Johnson',
              role: 'Software Engineer',
              text: 'FluffyJobs Pro helped me find my dream job 3x faster. The ad-free experience is amazing!',
              rating: 5,
            },
            {
              name: 'Mike Chen',
              role: 'Product Manager',
              text: 'Priority applications and salary insights gave me a huge advantage in negotiations.',
              rating: 5,
            },
            {
              name: 'Emily Davis',
              role: 'UX Designer',
              text: 'The premium support team helped me optimize my profile. Got 5 interviews in one week!',
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card elevation={2} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {testimonial.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {testimonial.role}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default UpgradePage;
