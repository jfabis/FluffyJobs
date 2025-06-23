import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, Star } from '@mui/icons-material';

const AdBanner = ({ onUpgrade }) => {
  const [isVisible, setIsVisible] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isVisible) return null;

  return (
    <Fade in={isVisible}>
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: isMobile ? 0 : '280px', // KLUCZOWE: margines dla sidebara na desktop
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 3s ease infinite',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '120px',
          width: isMobile ? '100%' : 'calc(100% - 280px)', // KLUCZOWE: szerokość minus sidebar
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 40,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              AD
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              🚀 Tired of ads? Upgrade to FluffyJobs Pro!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Get ad-free experience + premium features for just $9.99/month
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Star />}
            onClick={onUpgrade}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 3,
            }}
          >
            Upgrade Now
          </Button>

          <IconButton
            onClick={() => setIsVisible(false)}
            sx={{ color: 'white' }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
};

export default AdBanner;
