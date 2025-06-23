import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  People,
  Business,
  Language,
  CalendarToday,
  CheckCircle,
  Work,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCompanyById, jobs } = useJobs();
  
  const company = getCompanyById(id);
  
  // Znajdź oferty pracy dla tej firmy
  const companyJobs = jobs.filter(job => 
    job.company.toLowerCase() === company?.name.toLowerCase()
  );

  if (!company) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Company not found. Please check the URL or go back to the companies list.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/companies')}
          sx={{ mt: 2 }}
        >
          Back to Companies
        </Button>
      </Container>
    );
  }

  const getCompanyInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/companies')}
        sx={{ mb: 3 }}
      >
        Back to Companies
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              {/* Company Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    mr: 3,
                  }}
                >
                  {getCompanyInitials(company.name)}
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {company.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {company.industry}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body1">
                        {company.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <People fontSize="small" color="action" />
                      <Typography variant="body1">
                        {company.employees} employees
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Company Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  About {company.name}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                  {company.description}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  We are committed to innovation, excellence, and creating a positive impact in our industry. 
                  Our team of talented professionals works together to deliver outstanding results for our clients 
                  and create meaningful solutions that make a difference.
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Tech Stack */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Technology Stack
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {company.tech_stack.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Benefits */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Benefits & Perks
                </Typography>
                <List>
                  {company.benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Open Positions */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Open Positions ({companyJobs.length})
                </Typography>
                {companyJobs.length > 0 ? (
                  <Grid container spacing={2}>
                    {companyJobs.map((job) => (
                      <Grid item xs={12} key={job.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <CardContent sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {job.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {job.location} • {job.type} • {job.salary}
                                </Typography>
                              </Box>
                              <Button variant="outlined" size="small">
                                View Job
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No open positions at the moment. Check back later for new opportunities!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Company Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Industry
                </Typography>
                <Typography variant="body1">
                  {company.industry}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Company Size
                </Typography>
                <Typography variant="body1">
                  {company.size} employees
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Founded
                </Typography>
                <Typography variant="body1">
                  {company.founded}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {company.location}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Website
                </Typography>
                <Typography variant="body1">
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {company.website}
                  </a>
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Work />}
                onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}`)}
              >
                View All Jobs
              </Button>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Stats
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Open Positions
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {company.open_positions}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Employees
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {company.employees}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Founded
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {company.founded}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyDetailPage;
