import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Business,
  LocationOn,
  People,
  Work,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  
  const navigate = useNavigate();
  const { companies, loading } = useJobs();

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    const matchesSize = sizeFilter === 'all' || company.size === sizeFilter;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const industries = [...new Set(companies.map(company => company.industry))];
  const sizes = [...new Set(companies.map(company => company.size))];

  const getCompanyInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
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
          Explore Companies
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover {companies.length} amazing companies looking for talented professionals
        </Typography>

        {/* Search and Filters */}
        <Card elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={industryFilter}
                  label="Industry"
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Industries</MenuItem>
                  {industries.map(industry => (
                    <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Company Size</InputLabel>
                <Select
                  value={sizeFilter}
                  label="Company Size"
                  onChange={(e) => setSizeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Sizes</MenuItem>
                  {sizes.map(size => (
                    <MenuItem key={size} value={size}>{size} employees</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'} found
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>

        {/* Company Grid */}
        <Grid container spacing={3}>
          {filteredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate(`/companies/${company.id}`)}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Company Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        mr: 2,
                      }}
                    >
                      {getCompanyInitials(company.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {company.industry}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Company Info */}
                  <Box sx={{ mb: 2, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {company.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {company.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <People fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {company.employees} employees
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                      <Work fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {company.open_positions} open position{company.open_positions !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tech Stack */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Tech Stack:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {company.tech_stack.slice(0, 4).map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {company.tech_stack.length > 4 && (
                        <Chip
                          label={`+${company.tech_stack.length - 4}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', opacity: 0.7 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* View Company Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Business />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/companies/${company.id}`);
                    }}
                  >
                    View Company
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredCompanies.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              No companies found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or filters
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSearchQuery('');
                setIndustryFilter('all');
                setSizeFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CompaniesPage;
