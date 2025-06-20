import React, { createContext, useContext, useReducer } from 'react';

const JobContext = createContext();

const jobReducer = (state, action) => {
  switch (action.type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    default:
      return state;
  }
};

export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, {
    jobs: [],
    loading: false,
    filters: {
      search: '',
      location: '',
      jobType: '',
      salaryRange: '',
    },
  });

  const setJobs = (jobs) => {
    dispatch({ type: 'SET_JOBS', payload: jobs });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const addJob = (job) => {
    dispatch({ type: 'ADD_JOB', payload: job });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  return (
    <JobContext.Provider value={{
      ...state,
      setJobs,
      setLoading,
      addJob,
      setFilters,
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
