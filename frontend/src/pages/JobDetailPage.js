import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocationOn,
  Work,
  Schedule,
  AttachMoney,
  Business,
  CheckCircle,
} from '@mui/icons-material';

const JobDetailPage = () => {
  const { id } = useParams();

  // Mock job data - w rzeczywistej aplikacji pobieraĹ‚byĹ› to z API
  const job = {
    id: id,
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '\,000 - \,000',
    type: 'Full-time',
    posted: '2 days ago',
    applicants: 45,
    logo: 'đźš€',
    description: 'We are looking for a Senior React Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using React.js and related technologies.',
    requirements: [
      '5+ years of experience with React.js',
      'Strong knowledge of JavaScript ES6+',
      'Experience with Redux or Context API',
      'Familiarity with RESTful APIs',
      'Knowledge of Git version control',
      'Bachelor\'s degree in Computer Science or related field',
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible working hours',
      'Remote work options',
      'Professional development budget',
      'Gym membership',
    ],
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ mr: 3, width: 64, height: 64, fontSize: '2rem' }}>
                  {job.logo}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {job.title}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                    {job.company}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.type}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.salary}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Job Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {job.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Requirements
                </Typography>
                <List>
                  {job.requirements.map((requirement, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={requirement} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Benefits
                </Typography>
                <List>
                  {job.benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent sx={{ p: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mb: 2, py: 1.5 }}
              >
                Apply Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{ mb: 3, py: 1.5 }}
              >
                Save Job
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Posted
                </Typography>
                <Typography variant="body1">{job.posted}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Applicants
                </Typography>
                <Typography variant="body1">{job.applicants} people applied</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Job Type
                </Typography>
                <Chip label={job.type} color="primary" variant="outlined" />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Share this job
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined">
                  LinkedIn
                </Button>
                <Button size="small" variant="outlined">
                  Twitter
                </Button>
                <Button size="small" variant="outlined">
                  Copy Link
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobDetailPage;
