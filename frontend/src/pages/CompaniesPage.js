import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Rating,
  Divider,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Business,
  People,
  Star,
  Verified,
  Language,
  Work,
  TrendingUp,
  FilterList,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CompaniesPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    industry: '',
    size: '',
  });
  const [followedCompanies, setFollowedCompanies] = useState(new Set());

  const companies = [
    {
      id: 1,
      name: 'Google',
      logo: 'G',
      color: '#4285f4',
      industry: 'Technology',
      location: 'Mountain View, CA',
      employees: '100,000+',
      openJobs: 234,
      rating: 4.5,
      verified: true,
      description: 'A multinational technology company that specializes in Internet-related services and products.',
      website: 'google.com',
      founded: 1998,
      specialties: ['Search', 'AI', 'Cloud Computing', 'Mobile'],
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: 'M',
      color: '#00a1f1',
      industry: 'Technology',
      location: 'Redmond, WA',
      employees: '200,000+',
      openJobs: 189,
      rating: 4.4,
      verified: true,
      description: 'A multinational technology corporation that develops computer software, consumer electronics.',
      website: 'microsoft.com',
      founded: 1975,
      specialties: ['Software', 'Cloud', 'Gaming', 'Productivity'],
    },
    {
      id: 3,
      name: 'Apple',
      logo: 'A',
      color: '#000000',
      industry: 'Technology',
      location: 'Cupertino, CA',
      employees: '150,000+',
      openJobs: 156,
      rating: 4.3,
      verified: true,
      description: 'A multinational technology company that designs and manufactures consumer electronics.',
      website: 'apple.com',
      founded: 1976,
      specialties: ['Hardware', 'Software', 'Design', 'Innovation'],
    },
    {
      id: 4,
      name: 'Amazon',
      logo: 'A',
      color: '#ff9900',
      industry: 'E-commerce',
      location: 'Seattle, WA',
      employees: '1,500,000+',
      openJobs: 298,
      rating: 4.2,
      verified: true,
      description: 'A multinational technology company focusing on e-commerce, cloud computing, and AI.',
      website: 'amazon.com',
      founded: 1994,
      specialties: ['E-commerce', 'AWS', 'Logistics', 'AI'],
    },
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'E-commerce',
    'Entertainment',
  ];

  const companySizes = [
    '1-50',
    '51-200',
    '201-1000',
    '1001-5000',
    '5000+',
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFollowCompany = (companyId) => {
    setFollowedCompanies(prev => {
      const newFollowed = new Set(prev);
      if (newFollowed.has(companyId)) {
        newFollowed.delete(companyId);
      } else {
        newFollowed.add(companyId);
      }
      return newFollowed;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Discover Companies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore {companies.length} top companies and find your perfect workplace
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search companies..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
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
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={filters.industry}
                label="Industry"
                onChange={(e) => handleFilterChange('industry', e.target.value)}
              >
                <MenuItem value="">All Industries</MenuItem>
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Company Size</InputLabel>
              <Select
                value={filters.size}
                label="Company Size"
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <MenuItem value="">All Sizes</MenuItem>
                {companySizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} employees
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {companies.map((company) => (
          <Grid item xs={12} md={6} lg={4} key={company.id}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
                position: 'relative',
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: company.color,
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      mr: 2,
                    }}
                  >
                    {company.logo}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {company.name}
                      </Typography>
                      {company.verified && (
                        <Verified sx={{ fontSize: 18, color: 'primary.main' }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={company.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({company.rating})
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => toggleFollowCompany(company.id)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {followedCompanies.has(company.id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={company.industry}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {company.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {company.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {company.employees} employees
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Language sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {company.website}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Business sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Founded {company.founded}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Specialties:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {company.specialties.slice(0, 3).map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {company.specialties.length > 3 && (
                      <Chip
                        label={'More...'}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        {company.openJobs} open jobs
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to={'/companies/' + company.id}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      View Company
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      to={'/jobs?company=' + company.name}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      View Jobs
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
          }}
        >
          Load More Companies
        </Button>
      </Box>
    </Container>
  );
};

export default CompaniesPage;