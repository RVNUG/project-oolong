import { TeamMember } from '../types';
import teamData from '../assets/data/team.json';

/**
 * Fetch team members data - always uses team.json data
 * @returns Promise with team members data
 */
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    // Always use the local team data
    return teamData as TeamMember[];
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
    // Always use the local team data
    const member = teamData.find(m => m.id.toString() === id.toString());
    return member as TeamMember || null;
  } catch (error) {
    console.error(`Error fetching team member ID ${id}:`, error);
    throw error;
  }
}; 