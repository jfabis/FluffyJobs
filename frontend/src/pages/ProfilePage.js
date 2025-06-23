import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  IconButton,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Add,
  Delete,
  Upload,
  CloudUpload,
  Person,
  Work,
  School,
  Language,
  Star,
  LinkedIn,
  GitHub,
  Web,
  Email,
  Phone,
  LocationOn,
  Visibility,
  VisibilityOff,
  FileDownload,
  Share,
  Verified
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Function to generate initials from name
  const getInitials = (name) => {
    if (!name) return 'UN';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  // Profile state with default values and Google data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: 'Kielce, Świętokrzyskie, Poland',
    title: '',
    experience: '',
    salary: '',
    availability: 'Available immediately',
    workType: 'Hybrid',
    skills: [],
    languages: [
      { name: 'Polish', level: 'Native' }
    ],
    about: '',
    education: [],
    certifications: [],
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    },
    isProfilePublic: true,
    cvUploaded: false,
    profileCompletion: 15, // Initial low value
    googlePhotoUrl: null
  });

  // Effect to load data from Google OAuth
  useEffect(() => {
    if (user) {
      console.log('User data from Google:', user); // Debug

      // Calculate profile completion
      const calculateProfileCompletion = (userData) => {
        let completion = 0;
        const fields = [
          userData.name || userData.displayName,
          userData.email,
          profileData.phone,
          profileData.title,
          profileData.experience,
          profileData.about,
          profileData.skills.length > 0,
          profileData.languages.length > 0
        ];

        const filledFields = fields.filter(field => field && field !== '').length;
        completion = Math.round((filledFields / fields.length) * 100);
        return Math.max(completion, 15); // Minimum 15%
      };

      setProfileData(prev => ({
        ...prev,
        fullName: user.name || user.displayName || user.given_name + ' ' + (user.family_name || '') || prev.fullName,
        email: user.email || prev.email,
        googlePhotoUrl: user.picture || user.photoURL || null,
        profileCompletion: calculateProfileCompletion(user)
      }));
    }
  }, [user]);

  // Function to recalculate profile completion
  const recalculateProfileCompletion = (data) => {
    const fields = [
      data.fullName,
      data.email,
      data.phone,
      data.title,
      data.experience,
      data.about,
      data.skills.length > 0,
      data.languages.length > 0,
      data.education.length > 0,
      data.cvUploaded
    ];

    const filledFields = fields.filter(field => field && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const [newSkill, setNewSkill] = useState({ name: '', level: 50 });
  const [newLanguage, setNewLanguage] = useState({ name: '', level: 'Basic' });

  const handleInputChange = (field, value) => {
    setProfileData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      // Recalculate profile completion after each change
      newData.profileCompletion = recalculateProfileCompletion(newData);
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      // Here you can add logic to save to database
      // e.g. API call to save user profile

      setSnackbar({ open: true, message: 'Profile has been updated!', severity: 'success' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({ open: true, message: 'An error occurred while saving the profile', severity: 'error' });
    }
  };

  const handleCancel = () => {
    // You can restore previous values here if needed
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.name.trim() && !profileData.skills.find(s => s.name === newSkill.name.trim())) {
      setProfileData(prev => {
        const newData = {
          ...prev,
          skills: [...prev.skills, { name: newSkill.name.trim(), level: newSkill.level }]
        };
        newData.profileCompletion = recalculateProfileCompletion(newData);
        return newData;
      });
      setNewSkill({ name: '', level: 50 });
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.filter(skill => skill.name !== skillToRemove)
      };
      newData.profileCompletion = recalculateProfileCompletion(newData);
      return newData;
    });
  };

  const addLanguage = () => {
    if (newLanguage.name.trim() && !profileData.languages.find(l => l.name === newLanguage.name.trim())) {
      setProfileData(prev => {
        const newData = {
          ...prev,
          languages: [...prev.languages, { name: newLanguage.name.trim(), level: newLanguage.level }]
        };
        newData.profileCompletion = recalculateProfileCompletion(newData);
        return newData;
      });
      setNewLanguage({ name: '', level: 'Basic' });
    }
  };

  const removeLanguage = (langToRemove) => {
    setProfileData(prev => {
      const newData = {
        ...prev,
        languages: prev.languages.filter(lang => lang.name !== langToRemove)
      };
      newData.profileCompletion = recalculateProfileCompletion(newData);
      return newData;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you can add logic to upload file to server
      setProfileData(prev => {
        const newData = { ...prev, cvUploaded: true };
        newData.profileCompletion = recalculateProfileCompletion(newData);
        return newData;
      });
      setSnackbar({ open: true, message: 'CV uploaded successfully!', severity: 'success' });
      setUploadDialogOpen(false);
    }
  };

  const getSkillColor = (level) => {
    if (level >= 80) return '#4caf50';
    if (level >= 60) return '#ff9800';
    return '#f44336';
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <Person /> },
    { id: 'professional', label: 'Professional', icon: <Work /> },
    { id: 'skills', label: 'Skills', icon: <Star /> },
    { id: 'education', label: 'Education', icon: <School /> },
    { id: 'languages', label: 'Languages', icon: <Language /> }
  ];

  // Component to display avatar
  const ProfileAvatar = () => {
    if (profileData.googlePhotoUrl) {
      return (
        <Avatar
          src={profileData.googlePhotoUrl}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        />
      );
    }

    return (
      <Avatar
        sx={{
          width: 120,
          height: 120,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: '2rem',
          fontWeight: 'bold',
          border: '4px solid white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        {getInitials(profileData.fullName)}
      </Avatar>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Header with avatar and basic info */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Verified sx={{ color: '#4caf50', fontSize: 20 }} />
              }
            >
              <ProfileAvatar />
            </Badge>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ color: '#333', fontWeight: 'bold' }}>
                {profileData.fullName || 'Complete your name'}
              </Typography>
              <Chip
                label="Google Profile"
                color="success"
                size="small"
                icon={<Verified />}
              />
            </Box>
            <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 500, mb: 1 }}>
              {profileData.title || 'Add your job title'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip icon={<LocationOn />} label={profileData.location} variant="outlined" />
              {profileData.experience && (
                <Chip icon={<Work />} label={`${profileData.experience} years experience`} variant="outlined" />
              )}
              <Chip
                icon={profileData.isProfilePublic ? <Visibility /> : <VisibilityOff />}
                label={profileData.isProfilePublic ? 'Public profile' : 'Private profile'}
                color={profileData.isProfilePublic ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {profileData.socialLinks.linkedin && (
                <IconButton color="primary" href={profileData.socialLinks.linkedin} target="_blank">
                  <LinkedIn />
                </IconButton>
              )}
              {profileData.socialLinks.github && (
                <IconButton color="primary" href={profileData.socialLinks.github} target="_blank">
                  <GitHub />
                </IconButton>
              )}
              {profileData.socialLinks.website && (
                <IconButton color="primary" href={profileData.socialLinks.website} target="_blank">
                  <Web />
                </IconButton>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Profile Completion
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `conic-gradient(#4caf50 0deg ${profileData.profileCompletion * 3.6}deg, #e0e0e0 ${profileData.profileCompletion * 3.6}deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6" fontWeight="bold">
                    {profileData.profileCompletion}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              {!isEditing ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    color="primary"
                  >
                    Share
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Information section for new users */}
      {profileData.profileCompletion < 50 && (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Complete now
            </Button>
          }
        >
          Welcome! Complete your profile to increase your chances of finding a job.
          Profile completion: {profileData.profileCompletion}%
        </Alert>
      )}

      {/* CV Upload Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CloudUpload sx={{ fontSize: 40, color: profileData.cvUploaded ? '#4caf50' : '#ff9800' }} />
            <Box>
              <Typography variant="h6">
                {profileData.cvUploaded ? 'CV uploaded' : 'Upload your CV'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {profileData.cvUploaded ? 'Last updated: 2 days ago' : 'Format: PDF, DOC, DOCX (max 5MB)'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {profileData.cvUploaded && (
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                color="primary"
              >
                Download
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}
            >
              {profileData.cvUploaded ? 'Update CV' : 'Upload CV'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Navigation tabs */}
      <Paper elevation={3} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              startIcon={tab.icon}
              sx={{
                minWidth: 150,
                py: 2,
                px: 3,
                borderRadius: 0,
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : 'inherit',
                '&:hover': {
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Content based on active tab */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {activeTab === 'personal' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                Personal Information
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Data retrieved from your Google account. You can edit it below.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />
                }}
                helperText={!isEditing && !profileData.fullName ? "Retrieved from Google" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                disabled={true} // Email from Google should not be editable
                variant="standard"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: '#667eea' }} />
                }}
                helperText="Email from Google account (cannot be edited)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#667eea' }} />
                }}
                placeholder="Enter phone number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: '#667eea' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.isProfilePublic}
                    onChange={(e) => handleInputChange('isProfilePublic', e.target.checked)}
                    disabled={!isEditing}
                    color="primary"
                  />
                }
                label="Public profile (visible to employers)"
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 'professional' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                Professional Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={profileData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                placeholder="e.g. Frontend Developer"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                value={profileData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                type="number"
                placeholder="e.g. 3"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salary Expectations (PLN)"
                value={profileData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                placeholder="e.g. 8000-12000"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Work Type</InputLabel>
                <Select
                  value={profileData.workType}
                  onChange={(e) => handleInputChange('workType', e.target.value)}
                  variant={isEditing ? "outlined" : "standard"}
                >
                  <MenuItem value="On-site">On-site</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Availability"
                value={profileData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="About Me"
                value={profileData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                placeholder="Describe your experience, career goals, strengths..."
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 'skills' && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
              Technical Skills
            </Typography>
            {profileData.skills.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                Add your skills so employers can better assess your competencies.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {profileData.skills.map((skill, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ p: 2, background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {skill.name}
                        </Typography>
                        {isEditing && (
                          <IconButton
                            size="small"
                            onClick={() => removeSkill(skill.name)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.level}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getSkillColor(skill.level),
                            borderRadius: 4
                          }
                        }}
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {skill.level}%
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {isEditing && (
              <Card sx={{ mt: 3, p: 2, border: '2px dashed #667eea' }}>
                <Typography variant="h6" gutterBottom>
                  Add New Skill
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Skill Name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    sx={{ minWidth: 200 }}
                    placeholder="e.g. JavaScript"
                  />
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" gutterBottom>
                      Level: {newSkill.level}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={newSkill.level}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={addSkill}
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Add
                  </Button>
                </Box>
              </Card>
            )}
          </Box>
        )}

        {activeTab === 'education' && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
              Education and Certifications
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Education
                </Typography>
                {profileData.education.map((edu, index) => (
                  <Card key={index} sx={{ mb: 2, p: 2, background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)' }}>
                    <Typography variant="h6">{edu.school}</Typography>
                    <Typography variant="body1" color="primary">{edu.degree} - {edu.field}</Typography>
                    <Typography variant="body2" color="textSecondary">{edu.year}</Typography>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Certifications
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.certifications.map((cert, index) => (
                    <Chip
                      key={index}
                      label={cert}
                      color="primary"
                      variant="outlined"
                      icon={<Verified />}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 'languages' && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
              Language Proficiency
            </Typography>
            <Grid container spacing={2}>
              {profileData.languages.map((lang, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ p: 2, background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {lang.name}
                        </Typography>
                        <Chip
                          label={lang.level}
                          size="small"
                          color={lang.level === 'Native' ? 'success' : lang.level === 'Advanced' ? 'primary' : 'default'}
                        />
                      </Box>
                      {isEditing && (
                        <IconButton
                          size="small"
                          onClick={() => removeLanguage(lang.name)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {isEditing && (
              <Card sx={{ mt: 3, p: 2, border: '2px dashed #667eea' }}>
                <Typography variant="h6" gutterBottom>
                  Add language
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Language"
                    value={newLanguage.name}
                    onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={newLanguage.level}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value }))}
                    >
                      <MenuItem value="Basic">Basic</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                      <MenuItem value="Native">Native</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={addLanguage}
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Dodaj
                  </Button>
                </Box>
              </Card>
            )}
          </Box>
        )}
      </Paper>

      {/* CV Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Prześlij CV</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CloudUpload sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Wybierz plik CV
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Akceptowane formaty: PDF, DOC, DOCX (max 5MB)
            </Typography>
            <input
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="cv-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="cv-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                sx={{ mt: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Wybierz plik
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Anuluj</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
