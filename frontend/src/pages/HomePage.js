import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Fade,
  Grow,
  Slide,
  Stack,
  Divider,
  Rating,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  Work,
  Business,
  LocationOn,
  TrendingUp,
  People,
  Star,
  BookmarkBorder,
  Bookmark,
  ArrowForward,
  Schedule,
  AttachMoney,
  Verified,
  Launch,
  Favorite,
  Share,
  ExpandMore,
  PlayArrow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { jobs, companies, loading, saveJob, unsaveJob, isJobSaved } = useJobs();
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    setAnimationTrigger(true);
  }, []);

  // Wybierz 3 najnowsze oferty pracy (Featured Jobs)
  const featuredJobs = jobs.slice(0, 3);
  
  // Wybierz 4 największe firmy (Top Companies)
  const topCompanies = companies.slice(0, 4);

  const handleSaveJob = (jobId, event) => {
    event.stopPropagation();
    if (isJobSaved(jobId)) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  const getCompanyInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'primary';
      case 'Part-time': return 'secondary';
      case 'Contract': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" width="100%" height={140} />
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section with Advanced Styling */}
      <Fade in={animationTrigger} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Find Your Dream Job with FluffyJobs
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Connect with top companies and discover opportunities that match your skills and aspirations
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/jobs')}
              startIcon={<Work />}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Browse Jobs
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/companies')}
              startIcon={<Business />}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Companies
            </Button>
          </Stack>
        </Box>
      </Fade>

      {/* Enhanced Stats Section */}
      <Slide in={animationTrigger} direction="up" timeout={1200}>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            { value: `${jobs.length}+`, label: 'Active Jobs', color: 'primary.main', icon: <Work /> },
            { value: `${companies.length}+`, label: 'Top Companies', color: 'success.main', icon: <Business /> },
            { value: '2,500+', label: 'Job Seekers', color: 'warning.main', icon: <People /> },
            { value: '95%', label: 'Success Rate', color: 'error.main', icon: <TrendingUp /> },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={animationTrigger} timeout={1000 + index * 200}>
                <Paper 
                  elevation={4} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    '&:hover': {
                      elevation: 8,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ mt: 2, borderRadius: 1 }}
                  />
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Slide>

      {/* Professional Featured Jobs Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Featured Jobs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hand-picked opportunities from top companies
            </Typography>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/jobs')}
            sx={{ borderRadius: 3 }}
          >
            View All Jobs
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredJobs.map((job, index) => (
            <Grid item xs={12} md={4} key={job.id}>
              <Grow in={animationTrigger} timeout={1000 + index * 300}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:hover': {
                      elevation: 8,
                      transform: 'translateY(-8px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {getCompanyInitials(job.company)}
                      </Avatar>
                    }
                    action={
                      <IconButton
                        onClick={(e) => handleSaveJob(job.id, e)}
                        sx={{ color: isJobSaved(job.id) ? 'primary.main' : 'text.secondary' }}
                      >
                        {isJobSaved(job.id) ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {job.title}
                      </Typography>
                    }
                    subheader={
                      <Typography variant="subtitle1" color="primary">
                        {job.company}
                      </Typography>
                    }
                  />

                  <CardContent sx={{ pt: 0 }}>
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachMoney fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {job.salary || 'Competitive salary'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Posted {job.posted_date}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={job.type}
                        color={getJobTypeColor(job.type)}
                        size="small"
                        icon={<Verified />}
                      />
                      {job.remote && (
                        <Chip label="Remote" color="success" size="small" icon={<Work />} />
                      )}
                      <Chip label={job.experience_level} variant="outlined" size="small" />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {job.description.substring(0, 100)}...
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {job.requirements.slice(0, 3).map((skill, skillIndex) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {job.requirements.length > 3 && (
                        <Chip
                          label={`+${job.requirements.length - 3}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.7rem', opacity: 0.7 }}
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Rating value={4.5} precision={0.5} size="small" readOnly />
                    <Button size="small" endIcon={<Launch />}>
                      Apply Now
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Professional Top Companies Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Top Companies
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join industry leaders and innovative startups
            </Typography>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/companies')}
            sx={{ borderRadius: 3 }}
          >
            View All Companies
          </Button>
        </Box>

        <Grid container spacing={3}>
          {topCompanies.map((company, index) => (
            <Grid item xs={12} sm={6} md={3} key={company.id}>
              <Grow in={animationTrigger} timeout={1200 + index * 200}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    textAlign: 'center',
                    borderRadius: 3,
                    '&:hover': {
                      elevation: 8,
                      transform: 'translateY(-8px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate(`/companies/${company.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 80,
                        height: 80,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: 3,
                      }}
                    >
                      {getCompanyInitials(company.name)}
                    </Avatar>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {company.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {company.industry}
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                      <Paper elevation={1} sx={{ p: 1, borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Employees
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {company.employees}
                        </Typography>
                      </Paper>
                      <Paper elevation={1} sx={{ p: 1, borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Open Jobs
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {company.open_positions}
                        </Typography>
                      </Paper>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {company.description.substring(0, 80)}...
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {company.tech_stack.slice(0, 2).map((tech, techIndex) => (
                        <Chip
                          key={techIndex}
                          label={tech}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {company.tech_stack.length > 2 && (
                        <Chip
                          label={`+${company.tech_stack.length - 2}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.7rem', opacity: 0.7 }}
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button size="small" startIcon={<Star />}>
                      Follow
                    </Button>
                    <Button size="small" startIcon={<Launch />}>
                      View Jobs
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Enhanced Call to Action */}
      <Fade in={animationTrigger} timeout={2000}>
        <Paper
          elevation={6}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Ready to Find Your Next Opportunity?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of professionals who found their dream jobs through FluffyJobs
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                startIcon={<PlayArrow />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started Today
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/jobs')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Browse Jobs
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default HomePage;
