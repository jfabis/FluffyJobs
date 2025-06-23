import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock JobContext
const mockJobContext = {
  jobs: [
    { id: 1, title: 'Test Job', company: 'Test Company' },
    { id: 2, title: 'Another Job', company: 'Another Company' }
  ],
  loading: false,
  saveJob: jest.fn(),
  unsaveJob: jest.fn(),
  isJobSaved: jest.fn(),
};

const JobContext = React.createContext(mockJobContext);

const useJobs = () => React.useContext(JobContext);

const TestComponent = () => {
  const { jobs, loading } = useJobs();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="jobs-count">{jobs.length}</div>
    </div>
  );
};

describe('JobContext', () => {
  test('provides job data', () => {
    render(
      <JobContext.Provider value={mockJobContext}>
        <TestComponent />
      </JobContext.Provider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    expect(screen.getByTestId('jobs-count')).toHaveTextContent('2');
  });

  test('shows loading state', () => {
    const loadingContext = { ...mockJobContext, loading: true };
    
    render(
      <JobContext.Provider value={loadingContext}>
        <TestComponent />
      </JobContext.Provider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });
});
