import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
  Paper,
  Stack,
  Breadcrumbs,
  Link,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  CardHeader,
  CardActions,
  Fab,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  LocationOn,
  Work,
  Schedule,
  Business,
  CheckCircle,
  BookmarkBorder,
  Bookmark,
  Share,
  ArrowBack,
  ExpandMore,
  Person,
  AttachMoney,
  Group,
  Language,
  Verified,
  TrendingUp,
  School,
  EmojiEvents,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, getCompanyById, saveJob, unsaveJob, isJobSaved } = useJobs();
  
  const job = getJobById(id);
  const company = job ? getCompanyById(job.company_id || 1) : null;

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" variant="filled">
          Job not found. Please check the URL or go back to the jobs list.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/jobs')}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  const handleSaveJob = () => {
    if (isJobSaved(job.id)) {
      unsaveJob(job.id);
    } else {
      saveJob(job.id);
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'primary';
      case 'Part-time': return 'secondary';
      case 'Contract': return 'warning';
      default: return 'default';
    }
  };

  const getCompanyInitials = (name) => {
    return name ? name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : 'CO';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/jobs"
          onClick={(e) => {
            e.preventDefault();
            navigate('/jobs');
          }}
        >
          Jobs
        </Link>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            {/* Header with gradient */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 4,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {job.title}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
                    {job.company}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title={isJobSaved(job.id) ? 'Remove from saved' : 'Save job'}>
                    <IconButton 
                      onClick={handleSaveJob} 
                      sx={{ 
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                      }}
                    >
                      {isJobSaved(job.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share job">
                    <IconButton sx={{ 
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn />
                    <Typography variant="body1">{job.location}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney />
                    <Typography variant="body1">{job.salary || 'Competitive'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule />
                    <Typography variant="body1">{job.posted_date}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group />
                    <Typography variant="body1">{job.company_size}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <Chip
                  label={job.type}
                  color={getJobTypeColor(job.type)}
                  sx={{ color: 'white', fontWeight: 600 }}
                />
                {job.remote && (
                  <Chip 
                    label="Remote" 
                    color="success" 
                    sx={{ color: 'white', fontWeight: 600 }}
                  />
                )}
                <Chip 
                  label={job.experience_level} 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                />
                <Chip 
                  label={job.industry} 
                  variant="outlined" 
                  sx={{ color: 'white', borderColor: 'white' }}
                />
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Job Description Accordion */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Job Description
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                    {job.description}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    We are looking for a talented professional to join our team and contribute to exciting projects. 
                    This role offers excellent opportunities for growth and development in a dynamic environment.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Requirements Accordion */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Requirements & Skills
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {job.requirements.map((requirement, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle color="primary" fontSize="small" />
                          <Typography variant="body1">{requirement}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Benefits Accordion */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Benefits & Perks
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {job.benefits.map((benefit, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmojiEvents color="success" fontSize="small" />
                          <Typography variant="body1">{benefit}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Application Timeline */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Application Process
                </Typography>
                <Timeline position="left">
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="primary">
                        <Person />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        Submit Application
                      </Typography>
                      <Typography>Complete your profile and submit your application</Typography>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="primary">
                        <School />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        Initial Review
                      </Typography>
                      <Typography>HR team reviews your application (2-3 days)</Typography>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="primary">
                        <Verified />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        Interview Process
                      </Typography>
                      <Typography>Technical and cultural fit interviews</Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Box>
            </CardContent>
          </Paper>
        </Grid>

        {/* Enhanced Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Apply Card */}
            <Card elevation={3}>
              <CardHeader
                title="Apply for this position"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mb: 2, py: 1.5 }}
                >
                  Apply Now
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleSaveJob}
                  startIcon={isJobSaved(job.id) ? <Bookmark /> : <BookmarkBorder />}
                  sx={{ py: 1.5 }}
                >
                  {isJobSaved(job.id) ? 'Saved' : 'Save Job'}
                </Button>
              </CardContent>
            </Card>

            {/* Company Card */}
            <Card elevation={3}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 56,
                      height: 56,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {getCompanyInitials(job.company)}
                  </Avatar>
                }
                title={job.company}
                subheader={job.industry}
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Industry
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {job.industry}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Company Size
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {job.company_size} employees
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {job.location}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Business />}
                  onClick={() => {
                    if (company) {
                      navigate(`/companies/${company.id}`);
                    } else {
                      navigate(`/companies/1`);
                    }
                  }}
                >
                  View Company Profile
                </Button>
              </CardActions>
            </Card>

            {/* Job Stats Card */}
            <Card elevation={3}>
              <CardHeader
                title="Job Statistics"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Applications
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      47
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Views
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      234
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Posted
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {job.posted_date}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="scroll to top"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default JobDetailPage;
