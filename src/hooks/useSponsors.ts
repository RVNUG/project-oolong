import { useState, useEffect, useCallback } from 'react';
import { Sponsor } from '../types';
import { fetchSponsors } from '../services/sponsorsService';

interface UseSponsorsReturn {
  sponsors: Sponsor[];
  sponsorsByLevel: Record<string, Sponsor[]>;
  loading: boolean;
  error: string | null;
  refreshSponsors: () => Promise<void>;
  platinumSponsors: Sponsor[];
}

export const useSponsors = (): UseSponsorsReturn => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorsByLevel, setSponsorsByLevel] = useState<Record<string, Sponsor[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to categorize sponsors by level
  const categorizeSponsors = useCallback((sponsorsList: Sponsor[]) => {
    const levels: Record<string, Sponsor[]> = {};
    
    sponsorsList.forEach(sponsor => {
      const level = sponsor.level.toLowerCase();
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(sponsor);
    });
    
    setSponsorsByLevel(levels);
  }, []);

  // Function to load sponsors
  const loadSponsors = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch sponsors from the API
      const fetchedSponsors = await fetchSponsors();
      setSponsors(fetchedSponsors);
      categorizeSponsors(fetchedSponsors);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load sponsors. Please try again later.';
      
      setError(errorMessage);
      console.error('Error loading sponsors:', err);
    } finally {
      setLoading(false);
    }
  }, [categorizeSponsors]);

  // Function to manually refresh sponsors
  const refreshSponsors = useCallback(async (): Promise<void> => {
    return loadSponsors();
  }, [loadSponsors]);

  // Load sponsors on component mount
  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  // Get platinum sponsors directly from sponsors by level
  const platinumSponsors = sponsorsByLevel['platinum'] || [];

  return { sponsors, sponsorsByLevel, loading, error, refreshSponsors, platinumSponsors };
};

export default useSponsors; 