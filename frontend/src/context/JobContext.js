import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs, mockCompanies, mockSkills } from '../data/mockData';
import { savedJobsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setJobs(mockJobs);
      setCompanies(mockCompanies);
      setSkills(mockSkills);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSavedJobs();
    } else {
      setSavedJobs([]);
      setSavedJobIds(new Set());
    }
  }, [isAuthenticated, user]);

  const loadSavedJobs = async () => {
    try {
      const response = await savedJobsAPI.getSavedJobs();
      const savedJobsData = response.data;
      setSavedJobs(savedJobsData);
      
      const savedIds = new Set(savedJobsData.map(savedJob => savedJob.job.id));
      setSavedJobIds(savedIds);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      // Fallback do localStorage dla niezalogowanych
      const saved = localStorage.getItem('savedJobs');
      if (saved) {
        const savedIds = JSON.parse(saved);
        setSavedJobIds(new Set(savedIds));
      }
    }
  };

  const getJobById = (id) => {
    return jobs.find(job => job.id === parseInt(id));
  };

  const getCompanyById = (id) => {
    return companies.find(company => company.id === parseInt(id));
  };

  const searchJobs = (query, filters) => {
    let filteredJobs = jobs;

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

    if (filters.type && filters.type !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }

    if (filters.remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.remote === filters.remote);
    }

    if (filters.experience && filters.experience !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.experiencelevel === filters.experience);
    }

    if (filters.location && filters.location !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filteredJobs;
  };

  const saveJob = async (jobId) => {
    // SprawdŸ czy u¿ytkownik jest zalogowany
    if (!isAuthenticated || !user) {
      alert('Musisz byæ zalogowany, aby zapisaæ ofertê pracy');
      return;
    }

    try {
      await savedJobsAPI.saveJob(jobId);
      setSavedJobIds(prev => new Set([...prev, jobId]));
      loadSavedJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      if (error.response?.status === 401) {
        alert('Sesja wygas³a. Zaloguj siê ponownie.');
      } else {
        alert('B³¹d podczas zapisywania oferty');
      }
      throw error;
    }
  };

  const unsaveJob = async (jobId) => {
    // SprawdŸ czy u¿ytkownik jest zalogowany
    if (!isAuthenticated || !user) {
      alert('Musisz byæ zalogowany, aby usun¹æ ofertê z zapisanych');
      return;
    }

    try {
      await savedJobsAPI.unsaveJob(jobId);
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      loadSavedJobs();
    } catch (error) {
      console.error('Error unsaving job:', error);
      if (error.response?.status === 401) {
        alert('Sesja wygas³a. Zaloguj siê ponownie.');
      } else {
        alert('B³¹d podczas usuwania oferty');
      }
      throw error;
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobIds.has(jobId);
  };

  const getSavedJobs = () => {
    if (isAuthenticated) {
      return savedJobs.map(savedJob => savedJob.job);
    } else {
      return [];
    }
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
      loadSavedJobs,
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
