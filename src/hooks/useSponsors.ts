import { useState, useEffect, useCallback } from 'react';
import { Sponsor } from '../types';
import { fetchSponsors } from '../services/sponsorsService';

interface UseSponsorsReturn {
  sponsors: Sponsor[];
  loading: boolean;
  error: string | null;
  refreshSponsors: () => Promise<void>;
}

export const useSponsors = (): UseSponsorsReturn => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load sponsors
  const loadSponsors = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch sponsors from the API
      const fetchedSponsors = await fetchSponsors();
      setSponsors(fetchedSponsors);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load sponsors. Please try again later.';
      
      setError(errorMessage);
      console.error('Error loading sponsors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to manually refresh sponsors
  const refreshSponsors = useCallback(async (): Promise<void> => {
    return loadSponsors();
  }, [loadSponsors]);

  // Load sponsors on component mount
  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  return { sponsors, loading, error, refreshSponsors };
};

export default useSponsors; 