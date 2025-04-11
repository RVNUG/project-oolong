import { useState, useEffect, useCallback } from 'react';
import { MeetupEvent } from '../types';
import { fetchEvents } from '../services/eventsService';

interface UseEventsReturn {
  events: MeetupEvent[];
  upcomingEvents: MeetupEvent[];
  pastEvents: MeetupEvent[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<MeetupEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<MeetupEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<MeetupEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to categorize events into upcoming and past
  const categorizeEvents = useCallback((eventsList: MeetupEvent[]) => {
    const now = new Date();
    
    const upcoming = eventsList
      .filter(event => {
        // If is_upcoming is explicitly set, prioritize that flag
        if (event.is_upcoming !== undefined) {
          return event.is_upcoming === true;
        }
        
        // Otherwise, determine based on date comparison
        try {
          // Create a date object using the YYYY-MM-DD and HH:MM format
          const eventDate = new Date(`${event.local_date}T${event.local_time}`);
          
          // Check if eventDate is valid before comparison
          if (!isNaN(eventDate.getTime())) {
            return eventDate >= now;
          }
        } catch (err) {
          console.error(`Error parsing date for event ${event.id}:`, err);
          // If we can't parse the date, default to treating as past
        }
        
        // Default to false if date parsing fails
        return false;
      })
      .sort((a, b) => {
        try {
          const dateA = new Date(`${a.local_date}T${a.local_time}`);
          const dateB = new Date(`${b.local_date}T${b.local_time}`);
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // Keep order the same if either date is invalid
          }
          
          return dateA.getTime() - dateB.getTime();
        } catch (err) {
          console.error('Error sorting events:', err);
          return 0;
        }
      });
      
    const past = eventsList
      .filter(event => {
        // If is_upcoming is explicitly set, prioritize that flag
        if (event.is_upcoming !== undefined) {
          return event.is_upcoming === false;
        }
        
        // Otherwise, determine based on date comparison
        try {
          const eventDate = new Date(`${event.local_date}T${event.local_time}`);
          
          // Check if eventDate is valid before comparison
          if (!isNaN(eventDate.getTime())) {
            return eventDate < now;
          }
        } catch (err) {
          console.error(`Error parsing date for event ${event.id}:`, err);
          // If we can't parse the date, default to treating as past
        }
        
        // Default to true if date parsing fails (assume past)
        return true;
      })
      .sort((a, b) => {
        try {
          const dateA = new Date(`${a.local_date}T${a.local_time}`);
          const dateB = new Date(`${b.local_date}T${b.local_time}`);
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // Keep order the same if either date is invalid
          }
          
          return dateB.getTime() - dateA.getTime(); // Past events in reverse chronological order
        } catch (err) {
          console.error('Error sorting past events:', err);
          return 0;
        }
      });
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, []);

  // Function to load events
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchEvents();
      setEvents(data);
      categorizeEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load events. Please try again later.';
      setError(errorMessage);
      console.error('Error in useEvents hook:', err);
    } finally {
      setLoading(false);
    }
  }, [categorizeEvents]);

  // Function to manually refresh events
  const refreshEvents = useCallback(async (): Promise<void> => {
    return loadEvents();
  }, [loadEvents]);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, upcomingEvents, pastEvents, loading, error, refreshEvents };
};

export default useEvents; 