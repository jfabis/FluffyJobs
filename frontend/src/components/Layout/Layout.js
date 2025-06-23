import React, { useState, useEffect, useRef } from 'react';
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
  Paper,
  ClickAwayListener,
  Chip,
  ListItemAvatar,
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
  Clear,
  Circle,
  SmartToy,
  PersonAdd,
  TrendingUp,
  BookmarkBorder,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import AdBanner from '../AdBanner/AdBanner';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [messagesAnchorEl, setMessagesAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({ jobs: [], companies: [], skills: [] });
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const searchInputRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const { getSavedJobs } = useJobs();
  const savedJobsCount = getSavedJobs().length;
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  const isProUser = user?.is_pro || false;

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'profile',
      title: 'Uzupełnij swój profil!',
      message: 'Dodaj zdjęcie i opis, aby zwiększyć swoje szanse na znalezienie pracy.',
      time: '2 godz. temu',
      isRead: false,
      icon: <Person color="primary" />,
    },
    {
      id: 2,
      type: 'job_match',
      title: 'Nowa oferta dla Ciebie!',
      message: 'Frontend Developer w Tech Corp - dopasowana do Twojego profilu.',
      time: '4 godz. temu',
      isRead: false,
      icon: <Work color="success" />,
    },
    {
      id: 3,
      type: 'trend',
      title: 'Popularne umiejętności',
      message: 'React i TypeScript są teraz najczęściej poszukiwane przez pracodawców.',
      time: '1 dzień temu',
      isRead: false,
      icon: <TrendingUp color="info" />,
    },
  ];

  const mockMessages = [
    {
      id: 1,
      sender: 'Anna Kowalska',
      avatar: 'AK',
      title: 'Rekruter Tech Corp',
      message: 'Dzień dobry! Interesuje nas Twój profil na stanowisko Frontend Developer...',
      time: '3 godz. temu',
      isRead: false,
    },
    {
      id: 2,
      sender: 'Piotr Nowak',
      avatar: 'PN',
      title: 'HR Manager StartupXYZ',
      message: 'Cześć! Chciałbym umówić się na rozmowę kwalifikacyjną...',
      time: '2 dni temu',
      isRead: true,
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMessagesOpen = (event) => {
    setMessagesAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleMessagesClose = () => {
    setMessagesAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const markNotificationAsRead = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = () => {
    setUnreadNotifications(0);
    handleNotificationsClose();
  };

  const markMessageAsRead = (messageId) => {
    console.log('Marking message as read:', messageId);
    setUnreadMessages(prev => Math.max(0, prev - 1));
  };

  const markAllMessagesAsRead = () => {
    setUnreadMessages(0);
    handleMessagesClose();
  };

  // Helper functions
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
  };

  const getUserEmail = () => {
    if (!user) return 'user@example.com';
    return user.email || 'user@example.com';
  };

  const getAvatarInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
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
              primary={
                item.text === 'Saved Jobs' && savedJobsCount > 0 
                  ? `${item.text} (${savedJobsCount})`
                  : item.text
              }
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
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: 1201,
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

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications Button */}
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
                sx={{
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Badge badgeContent={unreadNotifications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* Messages Button */}
              <IconButton
                color="inherit"
                onClick={handleMessagesOpen}
                sx={{
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Badge badgeContent={unreadMessages} color="error">
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
                  {getAvatarInitial()}
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

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 380,
            maxHeight: 500,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 75,
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
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Powiadomienia
          </Typography>
          {unreadNotifications > 0 && (
            <Button size="small" onClick={markAllNotificationsAsRead} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
              Oznacz jako przeczytane
            </Button>
          )}
        </Box>
        <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
          {mockNotifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                button
                onClick={() => markNotificationAsRead(notification.id)}
                sx={{
                  py: 1.5,
                  px: 2,
                  backgroundColor: !notification.isRead ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'primary.main',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {notification.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ p: 1.5, borderTop: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="text"
            size="small"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              color: 'primary.main',
              py: 1,
            }}
          >
            Zobacz wszystkie powiadomienia
          </Button>
        </Box>
      </Menu>

      {/* Messages Menu */}
      <Menu
        anchorEl={messagesAnchorEl}
        open={Boolean(messagesAnchorEl)}
        onClose={handleMessagesClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 380,
            maxHeight: 500,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 55,
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
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Wiadomości
          </Typography>
          {unreadMessages > 0 && (
            <Button size="small" onClick={markAllMessagesAsRead} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
              Oznacz jako przeczytane
            </Button>
          )}
        </Box>
        <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
          {mockMessages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem
                button
                onClick={() => markMessageAsRead(message.id)}
                sx={{
                  py: 1.5,
                  px: 2,
                  backgroundColor: !message.isRead ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'primary.main',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {message.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {message.sender}
                      </Typography>
                      {!message.isRead && (
                        <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {message.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {message.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {message.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ p: 1.5, borderTop: '1px solid #e0e0e0' }}>
          <Button
            fullWidth
            variant="text"
            size="small"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              color: 'primary.main',
              py: 1,
            }}
          >
            Zobacz wszystkie wiadomości
          </Button>
        </Box>
      </Menu>

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
            {getUserDisplayName()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getUserEmail()}
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
            zIndex: theme.zIndex.drawer,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#fafafa',
          minHeight: '100vh',
          paddingBottom: !isProUser ? '120px' : '0',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {!isProUser && <AdBanner onUpgrade={handleUpgrade} />}
    </Box>
  );
};

export default Layout;
