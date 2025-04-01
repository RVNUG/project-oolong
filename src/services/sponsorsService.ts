import { Sponsor } from '../types';
import { getResourceUrl } from '../utils/config';

/**
 * Fetch sponsors data from the public JSON file
 * @returns Promise with sponsors data
 */
export const fetchSponsors = async (): Promise<Sponsor[]> => {
  try {
    // Use the getResourceUrl utility to construct the correct URL
    const sponsorsUrl = getResourceUrl('data/sponsors.json');
    
    // Always use the JSON file from the public directory
    const response = await fetch(sponsorsUrl);
    if (!response.ok) {
      console.warn('Failed to fetch sponsors from public directory, using empty array as fallback');
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    // Fallback to empty array if there's an error
    return [];
  }
};

/**
 * Fetch sponsors filtered by level
 * @param level Sponsor level to filter by
 * @returns Promise with filtered sponsors data
 */
export const fetchSponsorsByLevel = async (level: string): Promise<Sponsor[]> => {
  try {
    const sponsors = await fetchSponsors();
    return sponsors.filter(sponsor => 
      sponsor.level.toLowerCase() === level.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching sponsors by level ${level}:`, error);
    throw error;
  }
}; 