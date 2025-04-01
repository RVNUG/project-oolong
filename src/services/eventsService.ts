import { MeetupEvent } from '../types';
import { getMeetupEvents } from './meetupService';
import { getResourceUrl } from '../utils/config';

/**
 * Fetch events data from local JSON file or fallback to API if needed
 * @returns Promise with events data
 */
export const fetchEvents = async (): Promise<MeetupEvent[]> => {
  try {
    // Use the getResourceUrl utility to construct the correct URL
    const eventsUrl = getResourceUrl('data/events.json');
    
    const response = await fetch(eventsUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      // Check if data contains an events array
      if (data.events && Array.isArray(data.events)) {
        return data.events;
      } else if (Array.isArray(data)) {
        // Handle case where data is directly an array of events
        return data;
      } else {
        console.warn('Events data has unexpected structure:', data);
        // Fallback to getMeetupEvents from meetupService
        return await getMeetupEvents();
      }
    }
    
    // Fallback to getMeetupEvents from meetupService which has additional fallbacks
    return await getMeetupEvents();
  } catch (error) {
    console.error('Error fetching events from local JSON:', error);
    // Fallback to API methods if local file fails
    return await getMeetupEvents();
  }
};

/**
 * Fetch a single event by ID
 * @param id Event ID
 * @returns Promise with the event data or null if not found
 */
export const fetchEventById = async (id: string): Promise<MeetupEvent | null> => {
  try {
    // Fetch all events and find the one with matching ID
    const events = await fetchEvents();
    return events.find(e => e.id.toString() === id.toString()) || null;
  } catch (error) {
    console.error(`Error fetching event ID ${id}:`, error);
    return null;
  }
}; 