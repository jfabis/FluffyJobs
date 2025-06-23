import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock AdBanner component
const AdBanner = ({ onUpgrade }) => {
  return (
    <div>
      <p>Tired of ads? Upgrade to Pro!</p>
      <p>Get ad-free experience with premium features</p>
      <button onClick={onUpgrade}>Upgrade Now</button>
      <span>AD</span>
    </div>
  );
};

describe('AdBanner', () => {
  const mockOnUpgrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders ad banner content', () => {
    render(<AdBanner onUpgrade={mockOnUpgrade} />);

    expect(screen.getByText(/tired of ads/i)).toBeInTheDocument();
    expect(screen.getByText(/get ad-free experience/i)).toBeInTheDocument();
    expect(screen.getByText('AD')).toBeInTheDocument();
  });

  test('renders upgrade button', () => {
    render(<AdBanner onUpgrade={mockOnUpgrade} />);

    const upgradeButton = screen.getByRole('button', { name: /upgrade now/i });
    expect(upgradeButton).toBeInTheDocument();
  });

  test('calls onUpgrade when button is clicked', () => {
    render(<AdBanner onUpgrade={mockOnUpgrade} />);

    const upgradeButton = screen.getByRole('button', { name: /upgrade now/i });
    fireEvent.click(upgradeButton);

    expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
  });
});
