import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEvents } from '../useEvents';
import { fetchEvents } from '../../services/eventsService';

// Mock the eventsService
vi.mock('../../services/eventsService');

describe('useEvents hook', () => {
  const mockUpcomingEvent = {
    id: 'e-1',
    name: 'Upcoming Event',
    status: 'upcoming',
    local_date: '2099-12-31', // Future date
    local_time: '10:00',
    description: 'Future event',
    venue: {
      name: 'Test Venue',
      address_1: 'Test Address',
      city: 'Roanoke',
      state: 'VA',
      country: 'us',
      zip: ''
    },
    link: 'https://test.com',
    is_upcoming: true,
    is_online: false
  };

  const mockPastEvent = {
    id: 'ep-1',
    name: 'Past Event',
    status: 'past',
    local_date: '2020-01-01', // Past date
    local_time: '10:00',
    description: 'Past event',
    venue: {
      name: 'Test Venue',
      address_1: 'Test Address',
      city: 'Roanoke',
      state: 'VA',
      country: 'us',
      zip: ''
    },
    link: 'https://test.com',
    is_upcoming: false,
    is_online: false
  };

  const mockEvents = [mockUpcomingEvent, mockPastEvent];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(fetchEvents).mockResolvedValue(mockEvents);
  });

  it('categorizes events correctly based on date', async () => {
    const { result } = renderHook(() => useEvents());

    // Wait for the hook to fetch data
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check if events are categorized correctly
    expect(result.current.upcomingEvents).toHaveLength(1);
    expect(result.current.pastEvents).toHaveLength(1);
    expect(result.current.upcomingEvents[0].id).toBe(mockUpcomingEvent.id);
    expect(result.current.pastEvents[0].id).toBe(mockPastEvent.id);
  });

  it('respects the is_upcoming flag when categorizing events', async () => {
    // Create an event with a past date but is_upcoming=true
    const futureEventWithPastDate = {
      ...mockPastEvent,
      id: 'e-special',
      is_upcoming: true
    };

    vi.mocked(fetchEvents).mockResolvedValue([futureEventWithPastDate]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // The event should be in the upcoming list despite having a past date
    expect(result.current.upcomingEvents).toHaveLength(1);
    expect(result.current.pastEvents).toHaveLength(0);
    expect(result.current.upcomingEvents[0].id).toBe('e-special');
  });

  it('handles refresh correctly', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Update mock to return different data for refresh
    const newEvent = {
      ...mockUpcomingEvent,
      id: 'e-new',
      name: 'New Event'
    };
    vi.mocked(fetchEvents).mockResolvedValue([newEvent]);

    // Call refresh
    await act(async () => {
      await result.current.refreshEvents();
    });

    // Check if events are updated
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].id).toBe('e-new');
    expect(fetchEvents).toHaveBeenCalledTimes(2);
  });
}); 