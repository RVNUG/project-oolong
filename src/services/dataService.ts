import { TeamMember, Sponsor } from '../types';

/**
 * Fetches team members from JSON file
 * @returns Promise that resolves to an array of TeamMember objects
 */
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await fetch('/data/team.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid team members data: expected an array');
    }
    
    return data;
  } catch (error) {
    console.error('Error loading team members:', error);
    throw error;
  }
};

/**
 * Fetches sponsors from JSON file
 * @returns Promise that resolves to an array of Sponsor objects
 */
export const fetchSponsors = async (): Promise<Sponsor[]> => {
  try {
    const response = await fetch('/data/sponsors.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sponsors: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid sponsors data: expected an array');
    }
    
    return data;
  } catch (error) {
    console.error('Error loading sponsors:', error);
    throw error;
  }
}; 