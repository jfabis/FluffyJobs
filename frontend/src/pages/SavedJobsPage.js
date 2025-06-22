import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  LocationOn,
  AttachMoney,
  AccessTime,
  Code,
  Brush,
  Analytics,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SavedJobsPage = () => {
  // Mock saved jobs
  const savedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      icon: <Code />,
      savedDate: '2 days ago',
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
      savedDate: '1 week ago',
      companyLogo: 'DS',
      companyColor: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Saved Jobs
        </Typography>
        <Typography variant="h6" color="text.secondary">
          You have {savedJobs.length} saved jobs
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {savedJobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: job.companyColor,
                          fontSize: '1.5rem',
                          fontWeight: 700,
                        }}
                      >
                        {job.companyLogo}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          {job.company}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                            {job.salary}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip label={job.type} size="small" color="primary" variant="outlined" />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Saved {job.savedDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        component={Link}
                        to={`/jobs/${job.id}`}
                      >
                        View Details
                      </Button>
                      <Button variant="outlined" fullWidth>
                        Remove from Saved
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SavedJobsPage;
