import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from '@mui/material';

const PostJobPage = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    jobType: 'full_time',
    location: '',
    salaryMin: '',
    salaryMax: ''
  });

  const jobTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Post Job:', jobData);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Post a New Job
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Job Title"
              value={jobData.title}
              onChange={(e) => setJobData({...jobData, title: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Company"
              value={jobData.company}
              onChange={(e) => setJobData({...jobData, company: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Job Description"
              multiline
              rows={4}
              value={jobData.description}
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Job Type"
              value={jobData.jobType}
              onChange={(e) => setJobData({...jobData, jobType: e.target.value})}
              margin="normal"
            >
              {jobTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Location"
              value={jobData.location}
              onChange={(e) => setJobData({...jobData, location: e.target.value})}
              margin="normal"
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Min Salary"
                type="number"
                value={jobData.salaryMin}
                onChange={(e) => setJobData({...jobData, salaryMin: e.target.value})}
                margin="normal"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max Salary"
                type="number"
                value={jobData.salaryMax}
                onChange={(e) => setJobData({...jobData, salaryMax: e.target.value})}
                margin="normal"
                sx={{ flex: 1 }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Post Job
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default PostJobPage;
