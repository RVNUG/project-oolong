import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act } from 'react';
import SponsorCard from '../SponsorCard';
import * as config from '../../utils/config';

// Mock the getResourceUrl function
vi.mock('../../utils/config', () => ({
  getResourceUrl: vi.fn((path) => path)
}));

describe('SponsorCard', () => {
  const mockSponsor = {
    id: 2,
    name: 'Ozmo',
    description: 'Ozmo provides digital support solutions',
    logo: 'ozmo_MD.png',
    website: 'https://ozmo.com/'
  };

  // Save original innerWidth
  const originalInnerWidth = window.innerWidth;
  
  // Reset mocks and window size after each test
  afterEach(() => {
    vi.clearAllMocks();
    // Reset window size to original
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    // Trigger resize event to reset internal state
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('renders sponsor information correctly', () => {
    render(<SponsorCard sponsor={mockSponsor} />);
    
    expect(screen.getByText(mockSponsor.name)).toBeInTheDocument();
    expect(screen.getByText(mockSponsor.description)).toBeInTheDocument();
    expect(screen.getByText('Visit Website')).toBeInTheDocument();
    
    const logo = screen.getByAltText(`${mockSponsor.name} logo`);
    expect(logo).toBeInTheDocument();
  });

  it('uses the regular medium size image on desktop', async () => {
    // Set desktop width
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });
      window.dispatchEvent(new Event('resize'));
    });

    render(<SponsorCard sponsor={mockSponsor} />);
    
    await waitFor(() => {
      // Check if getResourceUrl was called with the original medium logo path
      expect(config.getResourceUrl).toHaveBeenCalledWith(`images/sponsors/${mockSponsor.logo}`);
    });
    
    const logo = screen.getByAltText(`${mockSponsor.name} logo`);
    expect(logo).toBeInTheDocument();
  });

  it('uses the small size image on mobile', async () => {
    // Set mobile width
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480
      });
      window.dispatchEvent(new Event('resize'));
    });

    render(<SponsorCard sponsor={mockSponsor} />);
    
    await waitFor(() => {
      // Check if getResourceUrl was called with the small logo path
      const expectedSmallLogoPath = 'images/sponsors/ozmo_SM_320px.png';
      expect(config.getResourceUrl).toHaveBeenCalledWith(expectedSmallLogoPath);
    });
    
    const logo = screen.getByAltText(`${mockSponsor.name} logo`);
    expect(logo).toBeInTheDocument();
  });

  it('handles non-pattern logo names correctly', async () => {
    // Mock sponsor with logo that doesn't follow the _MD.png pattern
    const otherSponsor = {
      ...mockSponsor,
      logo: 'standard-logo.png'
    };
    
    // Set mobile width
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480
      });
      window.dispatchEvent(new Event('resize'));
    });

    render(<SponsorCard sponsor={otherSponsor} />);
    
    await waitFor(() => {
      // Should use the original logo name since it doesn't match the pattern
      expect(config.getResourceUrl).toHaveBeenCalledWith(`images/sponsors/${otherSponsor.logo}`);
    });
  });

  it('shows a fallback when the image fails to load', async () => {
    render(<SponsorCard sponsor={mockSponsor} />);
    
    // Get the image and simulate an error
    const logo = screen.getByAltText(`${mockSponsor.name} logo`);
    
    await act(async () => {
      fireEvent.error(logo);
    });
    
    // Now the fallback should be visible (first letter of sponsor name)
    await waitFor(() => {
      const fallback = screen.getByText('O');
      expect(fallback).toBeInTheDocument();
    });
  });
}); 