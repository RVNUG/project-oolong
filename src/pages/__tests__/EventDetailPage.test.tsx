import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import EventDetailPage from '../EventDetailPage';
import useEvents from '../../hooks/useEvents';
import { formatFullDate, formatTime } from '../../utils/dateFormatters';

// Mock the useEvents hook
vi.mock('../../hooks/useEvents');
vi.mock('../../components/JsonLd', () => ({
  default: (_props: { data: Record<string, unknown> }) => <div data-testid="json-ld" />
}));
vi.mock('../../components/SEO', () => ({
  default: ({ title }: { title: string }) => <div data-testid="seo">{title}</div>
}));

describe('EventDetailPage', () => {
  const mockEvent = {
    id: 'e-1',
    name: 'In Person: Code and Coffee on April 26th from 10am-1pm ET',
    status: 'upcoming',
    local_date: '2025-04-26',
    local_time: '10:00',
    description: 'Join us at Mill Mountain Coffee for code and coffee',
    venue: {
      name: 'Mill Mountain Coffee & Tea',
      address_1: 'Roanoke, VA',
      city: 'Roanoke',
      state: 'VA',
      country: 'us',
      zip: ''
    },
    link: 'https://www.meetup.com/roanoke-valley-net-user-group/events/307171614/',
    is_upcoming: true,
    is_online: false
  };

  beforeEach(() => {
    // Mock the useEvents hook to return our test data
    vi.mocked(useEvents).mockReturnValue({
      events: [mockEvent],
      upcomingEvents: [mockEvent],
      pastEvents: [],
      loading: false,
      error: null,
      refreshEvents: vi.fn().mockResolvedValue(undefined)
    });
  });

  it('displays the correct date and time format from events.json', () => {
    render(
      <MemoryRouter initialEntries={[`/event/${mockEvent.id}`]}>
        <Routes>
          <Route path="/event/:id" element={<EventDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Expected formatted date and time based on our utility functions
    const expectedFormattedDate = formatFullDate(mockEvent.local_date);
    const expectedFormattedTime = formatTime(mockEvent.local_time);

    // Check that the date is displayed correctly
    expect(screen.getByText(new RegExp(expectedFormattedDate))).toBeInTheDocument();
    
    // Check that the time is displayed correctly
    expect(screen.getByText(new RegExp(expectedFormattedTime))).toBeInTheDocument();
  });

  it('handles events with different times correctly', () => {
    // Create a modified event with a PM time
    const pmEvent = {
      ...mockEvent,
      id: 'e-2',
      local_time: '18:00',
      name: 'Evening Event at 6 PM'
    };
    
    vi.mocked(useEvents).mockReturnValue({
      events: [pmEvent],
      upcomingEvents: [pmEvent],
      pastEvents: [],
      loading: false,
      error: null,
      refreshEvents: vi.fn().mockResolvedValue(undefined)
    });

    render(
      <MemoryRouter initialEntries={[`/event/${pmEvent.id}`]}>
        <Routes>
          <Route path="/event/:id" element={<EventDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const expectedFormattedTime = formatTime(pmEvent.local_time);
    expect(screen.getByText(new RegExp(expectedFormattedTime))).toBeInTheDocument();
    expect(expectedFormattedTime).toBe('6:00 PM');
  });

  it('handles online events correctly', () => {
    // Create an online event
    const onlineEvent = {
      ...mockEvent,
      id: 'e-3',
      is_online: true,
      venue: {
        name: 'Online Event',
        address_1: '',
        city: '',
        state: '',
        country: 'us',
        zip: ''
      }
    };
    
    vi.mocked(useEvents).mockReturnValue({
      events: [onlineEvent],
      upcomingEvents: [onlineEvent],
      pastEvents: [],
      loading: false,
      error: null,
      refreshEvents: vi.fn().mockResolvedValue(undefined)
    });

    render(
      <MemoryRouter initialEntries={[`/event/${onlineEvent.id}`]}>
        <Routes>
          <Route path="/event/:id" element={<EventDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Use getAllByText to handle multiple elements with the same text
    const onlineElements = screen.getAllByText('Online Event');
    expect(onlineElements.length).toBeGreaterThan(0);
    
    // Alternatively, use a more specific selector to verify text in the venue area
    const venueElement = screen.getByText((content, element) => {
      return element?.className === 'event-venue' && content.includes('Online Event');
    });
    expect(venueElement).toBeInTheDocument();
  });
}); 