import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';
import { fetchTeamMembers } from '../services/teamService';

interface UseTeamMembersReturn {
  loading: boolean;
  error: string | null;
  teamMembers: TeamMember[];
  refreshTeamMembers: () => Promise<void>;
}

// Cache key for localStorage
const TEAM_CACHE_KEY = 'rvnug_team_cache';
const TEAM_CACHE_EXPIRY_KEY = 'rvnug_team_cache_expiry';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Function to save team members to cache
  const cacheTeamMembers = useCallback((members: TeamMember[]) => {
    try {
      localStorage.setItem(TEAM_CACHE_KEY, JSON.stringify(members));
      localStorage.setItem(TEAM_CACHE_EXPIRY_KEY, (Date.now() + CACHE_TTL).toString());
    } catch (error) {
      console.error('Error caching team members:', error);
    }
  }, []);

  // Function to get team members from cache
  const getTeamMembersFromCache = useCallback((): { members: TeamMember[] | null, isExpired: boolean } => {
    try {
      const cachedMembers = localStorage.getItem(TEAM_CACHE_KEY);
      const expiryTimestamp = localStorage.getItem(TEAM_CACHE_EXPIRY_KEY);
      
      if (!cachedMembers || !expiryTimestamp) {
        return { members: null, isExpired: true };
      }
      
      const isExpired = Date.now() > parseInt(expiryTimestamp, 10);
      return { 
        members: JSON.parse(cachedMembers) as TeamMember[], 
        isExpired 
      };
    } catch (error) {
      console.error('Error reading cached team members:', error);
      return { members: null, isExpired: true };
    }
  }, []);

  // Function to load team members with caching
  const loadTeamMembers = useCallback(async (skipCache = false): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first unless skipCache is true
      if (!skipCache) {
        const { members: cachedMembers, isExpired } = getTeamMembersFromCache();
        if (cachedMembers && !isExpired) {
          setTeamMembers(cachedMembers);
          setLoading(false);
          return;
        }
      }
      
      // Fetch from the API
      const members = await fetchTeamMembers();
      setTeamMembers(members);
      cacheTeamMembers(members);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load team members. Please try again later.';
      
      setError(errorMessage);
      console.error('Error loading team members:', err);
      
      // If we have an error, check if we have cached members to show
      const { members: cachedMembers } = getTeamMembersFromCache();
      if (cachedMembers && cachedMembers.length > 0) {
        setTeamMembers(cachedMembers);
      }
    } finally {
      setLoading(false);
    }
  }, [cacheTeamMembers, getTeamMembersFromCache]);

  // Function to manually refresh team members
  const refreshTeamMembers = useCallback(async (): Promise<void> => {
    return loadTeamMembers(true); // Skip cache when manually refreshing
  }, [loadTeamMembers]);

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  return { loading, error, teamMembers, refreshTeamMembers };
};

export default useTeamMembers; 