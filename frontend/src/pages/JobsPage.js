import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  AttachMoney,
  FilterList,
  Bookmark,
  BookmarkBorder,
  Code,
  Brush,
  Analytics,
  Verified,
  AccessTime,
  Business,
  TrendingUp,
  Clear,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const JobsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    salaryRange: '',
    experience: '',
  });
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Professional mock jobs data with realistic salaries
  const mockJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      salaryMin: 120000,
      salaryMax: 150000,
      type: 'Full-time',
      experience: 'Senior',
      icon: <Code />,
      posted: '2 days ago',
      applicants: 45,
      verified: true,
      featured: true,
      description: 'We are looking for a Senior React Developer to join our dynamic team and build cutting-edge web applications.',
      companyLogo: 'TC',
      companyColor: '#1976d2',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      remote: false,
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studio Pro',
      location: 'New York, NY',
      salary: '$85,000 - $110,000',
      salaryMin: 85000,
      salaryMax: 110000,
      type: 'Full-time',
      experience: 'Mid-level',
      icon: <Brush />,
      posted: '1 day ago',
      applicants: 32,
      verified: true,
      featured: false,
      description: 'Join our creative team as a UX Designer and help shape the future of digital experiences.',
      companyLogo: 'DS',
      companyColor: '#9c27b0',
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
      remote: true,
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataFlow Analytics',
      location: 'Remote',
      salary: '$130,000 - $160,000',
      salaryMin: 130000,
      salaryMax: 160000,
      type: 'Full-time',
      experience: 'Senior',
      icon: <Analytics />,
      posted: '3 days ago',
      applicants: 67,
      verified: true,
      featured: true,
      description: 'Analyze complex data sets and provide actionable insights to drive business decisions.',
      companyLogo: 'DF',
      companyColor: '#f57c00',
      skills: ['Python', 'SQL', 'Machine Learning', 'Tableau'],
      remote: true,
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      salary: '$75,000 - $95,000',
      salaryMin: 75000,
      salaryMax: 95000,
      type: 'Full-time',
      experience: 'Junior',
      icon: <Code />,
      posted: '1 week ago',
      applicants: 23,
      verified: false,
      featured: false,
      description: 'Build amazing user interfaces with modern technologies in a fast-paced startup environment.',
      companyLogo: 'SX',
      companyColor: '#4caf50',
      skills: ['Vue.js', 'CSS', 'JavaScript', 'Git'],
      remote: false,
    },
    {
      id: 5,
      title: 'Product Manager',
      company: 'InnovateCorp',
      location: 'Seattle, WA',
      salary: '$110,000 - $140,000',
      salaryMin: 110000,
      salaryMax: 140000,
      type: 'Full-time',
      experience: 'Senior',
      icon: <Business />,
      posted: '5 days ago',
      applicants: 89,
      verified: true,
      featured: false,
      description: 'Lead product development and strategy for our next-generation platform.',
      companyLogo: 'IC',
      companyColor: '#ff5722',
      skills: ['Strategy', 'Analytics', 'Agile', 'Leadership'],
      remote: true,
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Denver, CO',
      salary: '$100,000 - $130,000',
      salaryMin: 100000,
      salaryMax: 130000,
      type: 'Full-time',
      experience: 'Mid-level',
      icon: <Work />,
      posted: '4 days ago',
      applicants: 41,
      verified: true,
      featured: false,
      description: 'Manage cloud infrastructure and deployment pipelines for enterprise applications.',
      companyLogo: 'CT',
      companyColor: '#607d8b',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      remote: true,
    },
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry-level', 'Junior', 'Mid-level', 'Senior', 'Executive'];
  const salaryRanges = [
    { label: 'Any Salary', value: '' },
    { label: '$40k - $60k', value: '40000-60000' },
    { label: '$60k - $80k', value: '60000-80000' },
    { label: '$80k - $100k', value: '80000-100000' },
    { label: '$100k - $120k', value: '100000-120000' },
    { label: '$120k - $150k', value: '120000-150000' },
    { label: '$150k+', value: '150000+' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      salaryRange: '',
      experience: '',
    });
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const formatSalary = (salary) => {
    return salary.replace(/\$(\d+),(\d+)/g, '$$$1k').replace(/\$(\d+),(\d+),(\d+)/g, '$$$1$$2k');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Find Your Perfect Job
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Discover {mockJobs.length} opportunities waiting for you
          </Typography>
        </Box>

        {/* Advanced Filters */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search jobs, companies, skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={filters.jobType}
                  label="Job Type"
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  value={filters.experience}
                  label="Experience"
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                startIcon={<Clear />}
                sx={{ py: 1.8, borderRadius: 2 }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {/* Salary Filter */}
          <Box sx={{ mt: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Salary Range</InputLabel>
              <Select
                value={filters.salaryRange}
                label="Salary Range"
                onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {salaryRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Results Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            Showing {mockJobs.length} jobs
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select label="Sort by" defaultValue="newest">
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="salary">Highest Salary</MenuItem>
              <MenuItem value="relevance">Most Relevant</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Jobs List */}
        <Stack spacing={3}>
          {mockJobs.map((job) => (
            <Paper
              key={job.id}
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
                border: job.featured ? '2px solid #ff4081' : '1px solid #e0e0e0',
                position: 'relative',
              }}
            >
              {job.featured && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #ff4081, #f50057)',
                  }}
                />
              )}

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                      {/* Company Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                              {job.title}
                            </Typography>
                            {job.verified && (
                              <Verified sx={{ fontSize: 20, color: 'primary.main' }} />
                            )}
                            {job.featured && (
                              <Chip
                                label="Featured"
                                size="small"
                                sx={{ bgcolor: '#ff4081', color: 'white', fontWeight: 600 }}
                              />
                            )}
                          </Box>
                          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {job.company}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Job Details */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                            {job.remote && (
                              <Chip label="Remote" size="small" color="success" variant="outlined" />
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Work sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.type} • {job.experience}
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
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Posted {job.posted}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Description */}
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {job.description}
                      </Typography>

                      {/* Skills */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                        ))}
                      </Box>

                      {/* Footer Info */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                        <Typography variant="body2" color="text.secondary">
                          {job.applicants} applicants
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                            Actively hiring
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack spacing={2} alignItems="flex-end">
                      <IconButton
                        onClick={() => toggleSaveJob(job.id)}
                        sx={{ alignSelf: 'flex-end' }}
                      >
                        {savedJobs.has(job.id) ? (
                          <Bookmark color="primary" />
                        ) : (
                          <BookmarkBorder />
                        )}
                      </IconButton>

                      <Stack spacing={1} sx={{ width: '100%' }}>
                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          to={`/jobs/${job.id}`}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            borderRadius: 2,
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            borderRadius: 2,
                          }}
                        >
                          Quick Apply
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>
          ))}
        </Stack>

        {/* Load More */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 6,
              py: 1.5,
              borderRadius: 3,
            }}
          >
            Load More Jobs
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default JobsPage;
