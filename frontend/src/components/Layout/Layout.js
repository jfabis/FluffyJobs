import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Badge,
  InputBase,
  alpha,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Work,
  Person,
  PostAdd,
  Search as SearchIcon,
  Notifications,
  Message,
  Business,
  ExitToApp,
  Dashboard,
  Bookmark,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Find Jobs', icon: <Work />, path: '/jobs' },
    { text: 'Companies', icon: <Business />, path: '/companies' },
    ...(isAuthenticated ? [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'My Profile', icon: <Person />, path: '/profile' },
      { text: 'Saved Jobs', icon: <Bookmark />, path: '/saved-jobs' },
      { text: 'Post Job', icon: <PostAdd />, path: '/post-job' },
    ] : []),
  ];

  const drawer = (
    <Box>
      {/* Spacer for AppBar */}
      <Toolbar />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar - NAJWYŻSZY Z-INDEX */}
      <AppBar 
        position="fixed" 
        elevation={1}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1, // ← KLUCZOWE: wyższy z-index niż drawer
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component={Link}
            to="/"
            sx={{ 
              mr: 4,
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              display: { xs: 'none', md: 'block' },
            }}
          >
            FluffyJobs
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 25,
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#d0d0d0',
              },
              '&:focus-within': {
                backgroundColor: 'white',
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              maxWidth: 500,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search jobs, companies, skills..."
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1.5, 1, 1.5, 0),
                  paddingLeft: '3rem',
                  transition: theme.transitions.create('width'),
                  width: '100%',
                  fontSize: '0.95rem',
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                color="inherit"
                sx={{
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton 
                color="inherit"
                sx={{
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Badge badgeContent={2} color="error">
                  <Message />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="primary" 
                component={Link} 
                to="/login"
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/register"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Join now
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            minWidth: 200,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <MenuItem onClick={() => navigate('/profile')} sx={{ py: 1.5 }}>
          <Person sx={{ mr: 2, color: 'text.secondary' }} />
          My Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/dashboard')} sx={{ py: 1.5 }}>
          <Dashboard sx={{ mr: 2, color: 'text.secondary' }} />
          Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ExitToApp sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer - NIŻSZY Z-INDEX */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
            zIndex: theme.zIndex.drawer, // ← NIŻSZY z-index niż AppBar
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#fafafa',
          minHeight: '100vh',
        }}
      >
        {/* Toolbar Spacer - automatycznie dostosowuje się do wysokości AppBar */}
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
