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
        // If is_upcoming is explicitly set, use that
        if (event.is_upcoming !== undefined) {
          return event.is_upcoming === true;
        }
        
        // Otherwise, determine based on date comparison
        const eventDate = new Date(`${event.local_date}T${event.local_time}`);
        return eventDate >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.local_date}T${a.local_time}`);
        const dateB = new Date(`${b.local_date}T${b.local_time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
    const past = eventsList
      .filter(event => {
        // If is_upcoming is explicitly set, use that
        if (event.is_upcoming !== undefined) {
          return event.is_upcoming === false;
        }
        
        // Otherwise, determine based on date comparison
        const eventDate = new Date(`${event.local_date}T${event.local_time}`);
        return eventDate < now;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.local_date}T${a.local_time}`);
        const dateB = new Date(`${b.local_date}T${b.local_time}`);
        return dateB.getTime() - dateA.getTime(); // Past events in reverse chronological order
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