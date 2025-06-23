import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs, mockCompanies, mockSkills } from '../data/mockData';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    // Symuluj ładowanie danych
    setTimeout(() => {
      setJobs(mockJobs);
      setCompanies(mockCompanies);
      setSkills(mockSkills);
      
      // Załaduj zapisane oferty z localStorage
      const saved = localStorage.getItem('savedJobs');
      if (saved) {
        setSavedJobs(JSON.parse(saved));
      }
      
      setLoading(false);
    }, 500);
  }, []);

  const getJobById = (id) => {
    return jobs.find(job => job.id === parseInt(id));
  };

  const getCompanyById = (id) => {
    return companies.find(company => company.id === parseInt(id));
  };

  const searchJobs = (query, filters = {}) => {
    let filteredJobs = jobs;

    // Wyszukiwanie tekstowe
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.requirements.some(req => req.toLowerCase().includes(searchTerm))
      );
    }

    // Filtry
    if (filters.type && filters.type !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }

    if (filters.remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
    }

    if (filters.experience && filters.experience !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.experience_level === filters.experience);
    }

    if (filters.location && filters.location !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filteredJobs;
  };

  const saveJob = (jobId) => {
    const newSavedJobs = [...savedJobs, jobId];
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const unsaveJob = (jobId) => {
    const newSavedJobs = savedJobs.filter(id => id !== jobId);
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const isJobSaved = (jobId) => {
    return savedJobs.includes(jobId);
  };

  const getSavedJobs = () => {
    return jobs.filter(job => savedJobs.includes(job.id));
  };

  return (
    <JobContext.Provider value={{
      jobs,
      companies,
      skills,
      loading,
      getJobById,
      getCompanyById,
      searchJobs,
      saveJob,
      unsaveJob,
      isJobSaved,
      getSavedJobs,
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within JobProvider');
  }
  return context;
};
