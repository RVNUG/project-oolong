import { TeamMember } from '../types';
import { getResourceUrl } from '../utils/config';

/**
 * Fetch team members data from the public JSON file
 * @returns Promise with team members data
 */
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    // Use the getResourceUrl utility to construct the correct URL
    const teamUrl = getResourceUrl('data/team.json');
    
    // Fetch from the public directory
    const response = await fetch(teamUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid team members data: expected an array');
    }
    
    return data as TeamMember[];
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

/**
 * Fetch a single team member by ID
 * @param id Team member ID
 * @returns Promise with the team member data or null if not found
 */
export const fetchTeamMemberById = async (id: number | string): Promise<TeamMember | null> => {
  try {
    const teamMembers = await fetchTeamMembers();
    const member = teamMembers.find(m => m.id.toString() === id.toString());
    return member || null;
  } catch (error) {
    console.error(`Error fetching team member ID ${id}:`, error);
    throw error;
  }
}; 