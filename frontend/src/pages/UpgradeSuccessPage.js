import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UpgradeSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { upgradeToPro } = useAuth();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    console.log('Success page loaded, upgrading user to Pro...');
    
    // KLUCZOWE: Automatycznie upgrade user do Pro
    const upgradeUser = async () => {
      try {
        await upgradeToPro();
        console.log('User upgraded to Pro successfully');
        
        // Force refresh po 3 sekundach
        setTimeout(() => {
          console.log('Redirecting to dashboard with full page refresh...');
          window.location.href = '/dashboard';
        }, 3000);
      } catch (error) {
        console.error('Failed to upgrade user:', error);
      }
    };

    upgradeUser();
  }, [searchParams, upgradeToPro]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={4}>
        <CardContent sx={{ textAlign: 'center', p: 6 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
            Payment Successful!
          </Typography>
          
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Welcome to FluffyJobs Pro! 🎉
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your account has been upgraded successfully. Ads are now disabled and you have access to all premium features.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Updating your account and redirecting...
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/dashboard'}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
            }}
          >
            Go to Dashboard Now
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpgradeSuccessPage;
