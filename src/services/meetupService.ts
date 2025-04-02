import { MeetupEvent } from '../types';
import { getResourceUrl } from '../utils/config';

interface MeetupApiResponse {
  results: MeetupEvent[];
}

// Define window type augmentation for custom callback
declare global {
  interface Window {
    [key: string]: unknown;
  }
}

// Get group name from environment variable or use default
const MEETUP_GROUP_NAME = import.meta.env.VITE_APP_MEETUP_GROUP_NAME || 'roanoke-valley-net-user-group';

/**
 * Main function to get Meetup events, prioritizing local data
 * @returns Promise that resolves to an array of MeetupEvent objects
 */
export const getMeetupEvents = async (): Promise<MeetupEvent[]> => {
  try {
    // First try to load from local JSON file
    const localEvents = await fetchLocalEvents();
    
    // If we have local events, use them
    if (localEvents && localEvents.length > 0) {
      return localEvents;
    }
    
    // If no local events, try the API
    try {
      // Try JSONP approach first
      const events = await fetchMeetupEvents();
      return events;
    } catch (error) {
      console.error('JSONP approach failed, trying proxy:', error);
      // If JSONP fails, try CORS proxy
      const proxyEvents = await fetchMeetupEventsViaProxy();
      return proxyEvents;
    }
  } catch (error) {
    console.error('Failed to get Meetup events:', error);
    // Return empty array if everything fails
    return [];
  }
};

/**
 * Fetch events from Meetup API using JSONP approach to avoid CORS issues on GitHub Pages
 * @returns Promise that resolves to an array of MeetupEvent objects
 */
export const fetchMeetupEvents = (): Promise<MeetupEvent[]> => {
  return new Promise((resolve, reject) => {
    // Create a unique callback name
    const callbackName = `handleMeetupEvents_${Date.now()}`;
    const timeoutId = setTimeout(() => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window[callbackName];
      
      reject(new Error('Timed out waiting for Meetup API response'));
    }, 10000); // 10 second timeout
    
    // Add the callback function to the window object
    window[callbackName] = (data: MeetupApiResponse) => {
      // Clear timeout if it exists
      clearTimeout(timeoutId);
      
      // Clean up - remove the script and callback
      const script = document.getElementById('meetup-jsonp');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window[callbackName];
      
      // Resolve with the data
      resolve(data.results || []);
    };
    
    // Create a script element to load the Meetup API
    const script = document.createElement('script');
    script.id = 'meetup-jsonp';
    script.src = `https://api.meetup.com/${MEETUP_GROUP_NAME}/events?status=upcoming,past&desc=true&page=20&callback=${callbackName}`;
    
    // Handle errors
    script.onerror = () => {
      // Clear timeout if it exists
      clearTimeout(timeoutId);
      
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window[callbackName];
      
      reject(new Error('Failed to load Meetup events'));
    };
    
    // Add the script to the page
    document.head.appendChild(script);
  });
};

/**
 * Try to fetch events using CORS proxy as an alternative to JSONP
 * @returns Promise that resolves to an array of MeetupEvent objects
 */
export const fetchMeetupEventsViaProxy = async (): Promise<MeetupEvent[]> => {
  const proxyUrl = import.meta.env.VITE_APP_CORS_PROXY || 'https://corsproxy.io/?';
  const meetupApiUrl = `https://api.meetup.com/${MEETUP_GROUP_NAME}/events?status=upcoming,past&desc=true&page=20`;
  
  try {
    const response = await fetch(`${proxyUrl}${encodeURIComponent(meetupApiUrl)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from proxy: ${response.status}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching events via proxy:', error);
    throw error;
  }
};

/**
 * Fallback function to load events from local JSON file
 * @returns Promise that resolves to an array of MeetupEvent objects
 */
export const fetchLocalEvents = async (): Promise<MeetupEvent[]> => {
  try {
    // Use the getResourceUrl utility to construct the correct URL
    const eventsUrl = getResourceUrl('data/events.json');
    
    const response = await fetch(eventsUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to load local events: ${response.status}`);
    }
    
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error loading local events:', error);
    return [];
  }
}; 