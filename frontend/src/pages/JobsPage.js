import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Pagination,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  LocationOn,
  Work,
  Schedule,
  BookmarkBorder,
  Bookmark,
  Search,
  FilterList,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    type: 'all',
    remote: undefined,
    experience: 'all',
    location: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const jobsPerPage = 10;
  const navigate = useNavigate();
  const { jobs, loading, searchJobs, saveJob, unsaveJob, isJobSaved } = useJobs();

  const filteredJobs = searchJobs(searchQuery, filters);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  useEffect(() => {
    const search = searchParams.get('search');
    const skill = searchParams.get('skill');
    
    if (search) {
      setSearchQuery(search);
    }
    if (skill) {
      setSearchQuery(skill);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const handleSaveJob = (jobId, event) => {
    event.stopPropagation();
    const job = jobs.find(j => j.id === jobId);
    
    if (isJobSaved(jobId)) {
      unsaveJob(jobId);
      setSnackbar({
        open: true,
        message: `${job?.title} removed from saved jobs`,
        severity: 'info'
      });
    } else {
      saveJob(jobId);
      setSnackbar({
        open: true,
        message: `${job?.title} saved successfully!`,
        severity: 'success'
      });
    }
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
          Find Your Dream Job
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover {jobs.length} amazing opportunities waiting for you
        </Typography>

        {/* Search and Filters */}
        <Card elevation={2} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSearch}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ minWidth: 120 }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Box>
          </form>

          {showFilters && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Job Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Remote</InputLabel>
                  <Select
                    value={filters.remote === undefined ? 'all' : filters.remote}
                    label="Remote"
                    onChange={(e) => handleFilterChange('remote', e.target.value === 'all' ? undefined : e.target.value === 'true')}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="true">Remote</MenuItem>
                    <MenuItem value="false">On-site</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={filters.experience}
                    label="Experience"
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="Junior">Junior</MenuItem>
                    <MenuItem value="Mid">Mid</MenuItem>
                    <MenuItem value="Senior">Senior</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filters.location}
                    label="Location"
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="Warsaw">Warsaw</MenuItem>
                    <MenuItem value="Krakow">Krakow</MenuItem>
                    <MenuItem value="Gdansk">Gdansk</MenuItem>
                    <MenuItem value="Wroclaw">Wroclaw</MenuItem>
                    <MenuItem value="Poznan">Poznan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Card>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>

        {/* Job Listings */}
        <Grid container spacing={3}>
          {currentJobs.map((job) => (
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
                    <IconButton
                      onClick={(e) => handleSaveJob(job.id, e)}
                      sx={{ color: isJobSaved(job.id) ? 'primary.main' : 'text.secondary' }}
                    >
                      {isJobSaved(job.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
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
                        {job.posted_date}
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
                    {job.requirements.slice(0, 5).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {job.requirements.length > 5 && (
                      <Chip
                        label={`+${job.requirements.length - 5} more`}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.75rem', opacity: 0.7 }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              No jobs found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or filters
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  type: 'all',
                  remote: undefined,
                  experience: 'all',
                  location: 'all',
                });
                setSearchParams({});
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default JobsPage;
