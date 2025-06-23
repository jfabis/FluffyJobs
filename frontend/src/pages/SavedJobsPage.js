import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Alert,
  Paper,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn,
  Work,
  Schedule,
  BookmarkBorder,
  Bookmark,
  Delete,
  Search,
  FilterList,
  WorkOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const SavedJobsPage = () => {
  const navigate = useNavigate();
  const { getSavedJobs, unsaveJob, isJobSaved, loading } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  
  const savedJobs = getSavedJobs();
  
  // Filtrowanie zapisanych ofert
  const filteredJobs = savedJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnsaveJob = (jobId, event) => {
    event.stopPropagation();
    unsaveJob(jobId);
  };

  const formatSalary = (salary) => {
    return salary || 'Salary not specified';
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Saved Jobs
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved for later
        </Typography>

        {/* Search Bar */}
        {savedJobs.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Search color="action" />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  flex: 1,
                  padding: '8px 0',
                }}
              />
              {searchQuery && (
                <Button
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{ minWidth: 'auto' }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Paper>
        )}

        {/* Results Summary */}
        {savedJobs.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {filteredJobs.length} of {savedJobs.length} saved job{filteredJobs.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </Typography>
          </Box>
        )}

        {/* Saved Jobs List */}
        {savedJobs.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'grey.50',
            }}
          >
            <WorkOff sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              No Saved Jobs Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Start building your collection of interesting opportunities. 
              When you find jobs you like, click the bookmark icon to save them here.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/jobs')}
              sx={{ px: 4 }}
            >
              Browse Jobs
            </Button>
          </Paper>
        ) : filteredJobs.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              No jobs match your search
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search terms
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card
                  elevation={2}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                          {job.company}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={(e) => handleUnsaveJob(job.id, e)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { 
                              bgcolor: 'primary.light',
                              color: 'white'
                            }
                          }}
                        >
                          <Bookmark />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleUnsaveJob(job.id, e)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { 
                              bgcolor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Work fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatSalary(job.salary)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Saved recently
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {job.description.substring(0, 200)}...
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        label={job.type}
                        color={getJobTypeColor(job.type)}
                        size="small"
                      />
                      {job.remote && (
                        <Chip label="Remote" color="success" size="small" />
                      )}
                      <Chip label={job.experience_level} variant="outlined" size="small" />
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {job.requirements.slice(0, 4).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                      {job.requirements.length > 4 && (
                        <Chip
                          label={`+${job.requirements.length - 4} more`}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.75rem', opacity: 0.7 }}
                        />
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Click to view full details
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job.id}`);
                        }}
                      >
                        View Job
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Quick Actions */}
        {savedJobs.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate('/jobs')}
                startIcon={<Search />}
              >
                Find More Jobs
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove all ${savedJobs.length} saved jobs?`)) {
                    savedJobs.forEach(job => unsaveJob(job.id));
                  }
                }}
                startIcon={<Delete />}
                color="error"
              >
                Clear All Saved Jobs
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default SavedJobsPage;
