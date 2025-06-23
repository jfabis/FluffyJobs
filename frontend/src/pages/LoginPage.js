import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Jeśli już zalogowany, przekieruj do dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      // useEffect automatycznie przekieruje po zmianie isAuthenticated
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // NOWA FUNKCJA: Pobieranie prawdziwych danych użytkownika z Google API
  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      console.log('Fetching Google user info with access token...');
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const userInfo = await response.json();
        console.log('Successfully fetched Google user info:', userInfo);
        return userInfo;
      } else {
        console.error('Failed to fetch user info, status:', response.status);
        throw new Error('Failed to fetch user info from Google');
      }
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      throw error;
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google OAuth success, token response:', tokenResponse);
      setLoading(true);
      setError('');

      try {
        // NOWE: Pobierz rzeczywiste dane użytkownika z Google API
        const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);

        // NOWE: Stwórz obiekt z pełnymi danymi użytkownika
        const googleUserData = {
          access_token: tokenResponse.access_token,
          userInfo: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            given_name: userInfo.given_name,
            family_name: userInfo.family_name,
            picture: userInfo.picture,
            verified_email: userInfo.verified_email,
            locale: userInfo.locale
          }
        };

        console.log('Passing complete user data to AuthContext:', googleUserData);

        // Przekaż rzeczywiste dane do AuthContext
        await googleLogin(googleUserData);
        console.log('Google login processed successfully');
        // useEffect automatycznie przekieruje gdy isAuthenticated się zmieni
        
      } catch (err) {
        console.error('Google login processing failed:', err);
        setError(`Google login failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Google login was cancelled or failed');
      setLoading(false);
    },
    scope: 'openid email profile', // NOWE: Dodane scope dla pełnych danych
    flow: 'implicit', // NOWE: Zmienione na implicit żeby otrzymać access_token
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Sign in to your FluffyJobs account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Google />}
              onClick={() => googleLoginHandler()}
              disabled={loading}
              sx={{
                mb: 3,
                py: 1.5,
                bgcolor: '#4285f4',
                '&:hover': { bgcolor: '#3367d6' },
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or sign in with email
              </Typography>
            </Divider>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                margin="normal"
                required
                sx={{ mb: 2 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                margin="normal"
                required
                sx={{ mb: 3 }}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
                  Join now
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
