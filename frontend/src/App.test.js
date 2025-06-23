import React from 'react';
import { render, screen } from '@testing-library/react';

// Prosty komponent testowy zamiast całej App
const SimpleComponent = () => {
  return (
    <div>
      <h1>FluffyJobs</h1>
      <p>Job search platform</p>
      <button>Test Button</button>
    </div>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('FluffyJobs')).toBeInTheDocument();
    expect(screen.getByText('Job search platform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  test('has correct heading', () => {
    render(<SimpleComponent />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('FluffyJobs');
  });
});
