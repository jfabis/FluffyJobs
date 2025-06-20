import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostJobPage from './pages/PostJobPage';
import PaymentPage from './pages/PaymentPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077b5', // LinkedIn blue
      light: '#4db6e6',
      dark: '#004182',
    },
    secondary: {
      main: '#00a0dc',
      light: '#5eb3e6',
      dark: '#006fa3',
    },
    background: {
      default: '#f3f2ef',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000de',
      secondary: '#00000099',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <JobProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />`n                <Route path="/companies" element={<CompaniesPage />} />`n                <Route path="/companies/:id" element={<CompanyDetailPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/post-job" element={<PostJobPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </JobProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
