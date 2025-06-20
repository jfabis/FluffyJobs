import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Business,
  TrendingUp,
  People,
  Work,
  Code,
  Brush,
  Analytics,
  ArrowForward,
  Verified,
  BookmarkBorder,
  AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    navigate(`/jobs?search=${searchQuery}&location=${location}`);
  };

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      icon: <Code />,
      posted: '2 days ago',
      applicants: 45,
      verified: true,
      featured: true,
      companyLogo: 'TC',
      companyColor: '#1976d2',
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      salary: '$90k - $110k',
      type: 'Full-time',
      icon: <Brush />,
      posted: '1 day ago',
      applicants: 32,
      verified: true,
      featured: true,
      companyLogo: 'DS',
      companyColor: '#9c27b0',
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataFlow',
      location: 'Remote',
      salary: '$130k - $160k',
      type: 'Full-time',
      icon: <Analytics />,
      posted: '3 days ago',
      applicants: 67,
      verified: true,
      featured: true,
      companyLogo: 'DF',
      companyColor: '#f57c00',
    },
  ];

  const topCompanies = [
    { name: 'Google', jobs: 234, logo: 'G', color: '#4285f4', employees: '100k+' },
    { name: 'Microsoft', jobs: 189, logo: 'M', color: '#00a1f1', employees: '200k+' },
    { name: 'Apple', jobs: 156, logo: 'A', color: '#000000', employees: '150k+' },
    { name: 'Amazon', jobs: 298, logo: 'A', color: '#ff9900', employees: '1.5M+' },
  ];

  const stats = [
    { icon: <Work />, value: '10,000+', label: 'Active Jobs', color: '#1976d2' },
    { icon: <People />, value: '50,000+', label: 'Job Seekers', color: '#388e3c' },
    { icon: <Business />, value: '2,500+', label: 'Companies', color: '#f57c00' },
    { icon: <TrendingUp />, value: '95%', label: 'Success Rate', color: '#d32f2f' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Find Your Dream Job
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.9,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Connect with top companies and discover opportunities that match your skills
            </Typography>
          </Box>

          {/* Search Section */}
          <Paper
            elevation={8}
            sx={{
              p: 2,
              borderRadius: 4,
              maxWidth: 800,
              mx: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  Search Jobs
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
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
                <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Featured Jobs */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Featured Jobs
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Hand-picked opportunities from top companies
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/jobs"
              endIcon={<ArrowForward />}
              variant="outlined"
              size="large"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              View All Jobs
            </Button>
          </Box>

          <Grid container spacing={4}>
            {featuredJobs.map((job) => (
              <Grid item xs={12} md={4} key={job.id}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                    position: 'relative',
                  }}
                  component={Link}
                  to={`/jobs/${job.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  {job.featured && (
                    <Chip
                      label="Featured"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: '#ff4081',
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                      {/* Company Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: job.companyColor,
                            fontSize: '1.2rem',
                            fontWeight: 700,
                          }}
                        >
                          {job.companyLogo}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {job.company}
                            </Typography>
                            {job.verified && (
                              <Verified sx={{ fontSize: 18, color: 'primary.main' }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {job.type}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <BookmarkBorder />
                        </IconButton>
                      </Box>

                      {/* Job Title */}
                      <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                        {job.title}
                      </Typography>

                      {/* Location & Salary */}
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                            {job.salary}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider />

                      {/* Footer */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {job.posted}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {job.applicants} applicants
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Top Companies */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Top Companies
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Join industry leaders and innovative startups
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/companies"
              endIcon={<ArrowForward />}
              variant="outlined"
              size="large"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              View All Companies
            </Button>
          </Box>

          <Grid container spacing={3}>
            {topCompanies.map((company, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: company.color,
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {company.logo}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {company.employees} employees
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                    {company.jobs} open positions
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper
          elevation={4}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 8,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Find Your Next Opportunity?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
            Join thousands of professionals who found their dream jobs through FluffyJobs
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Get Started Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/post-job"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Post a Job
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
