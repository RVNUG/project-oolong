import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';
import { fetchTeamMembers } from '../services/teamService';

interface UseTeamReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refreshTeam: () => Promise<void>;
}

export const useTeam = (): UseTeamReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load team members
  const loadTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchTeamMembers();
      setTeamMembers(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load team members. Please try again later.';
      setError(errorMessage);
      console.error('Error in useTeam hook:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to manually refresh team members
  const refreshTeam = useCallback(async (): Promise<void> => {
    return loadTeamMembers();
  }, [loadTeamMembers]);

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  return { teamMembers, loading, error, refreshTeam };
};

export default useTeam; 