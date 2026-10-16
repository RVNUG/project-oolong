import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import EventCard from '../EventCard';
import { formatTime } from '../../utils/dateFormatters';
import type { ReactElement } from 'react';

describe('EventCard', () => {
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

  // Helper function to render EventCard with router
  const renderWithRouter = (ui: ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
  };

  it('displays event dates correctly', () => {
    renderWithRouter(<EventCard event={mockEvent} />);

    // Check that the event name is displayed
    expect(screen.getByText(mockEvent.name)).toBeInTheDocument();
    
    // Check for the month and day (from the date)
    const eventDate = new Date(`${mockEvent.local_date}T${mockEvent.local_time}`);
    const monthAbbr = eventDate.toLocaleString('default', { month: 'short' });
    const day = eventDate.getDate();
    
    expect(screen.getByText(monthAbbr)).toBeInTheDocument();
    expect(screen.getByText(day.toString())).toBeInTheDocument();
  });

  it('displays event time correctly', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    
    const expectedTime = formatTime(mockEvent.local_time);
    expect(screen.getByText(new RegExp(expectedTime))).toBeInTheDocument();
  });

  it('handles PM event times correctly', () => {
    const pmEvent = {
      ...mockEvent,
      local_time: '18:00',
      name: 'Evening Event at 6 PM'
    };
    
    renderWithRouter(<EventCard event={pmEvent} />);
    
    const expectedTime = formatTime(pmEvent.local_time);
    expect(expectedTime).toBe('6:00 PM');
    expect(screen.getByText(new RegExp(expectedTime))).toBeInTheDocument();
  });

  it('displays venue information correctly for in-person events', () => {
    renderWithRouter(<EventCard event={mockEvent} />);
    
    expect(screen.getByText(mockEvent.venue.name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockEvent.venue.city))).toBeInTheDocument();
  });

  it('displays online badge for online events', () => {
    const onlineEvent = {
      ...mockEvent,
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
    
    renderWithRouter(<EventCard event={onlineEvent} />);
    
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('Online Event')).toBeInTheDocument();
  });

  it('uses safe placeholders when date, time, description, and venue are missing', () => {
    renderWithRouter(<EventCard event={{
      ...mockEvent,
      local_date: '',
      local_time: '',
      description: '',
      venue: undefined,
    }} />);

    expect(screen.getAllByText('TBD')).toHaveLength(2);
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.getByText('Time TBD')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
    expect(screen.queryByText('Event completed')).not.toBeInTheDocument();
  });

  it('shows completed status instead of RSVP and calendar actions for past events', () => {
    renderWithRouter(<EventCard event={{
      ...mockEvent,
      local_date: '2020-01-01',
      local_time: '10:00',
      description: '<p>Past event description</p>',
    }} isHero isCompact />);

    expect(screen.getByText('Past')).toBeInTheDocument();
    expect(screen.getByText('Event completed')).toBeInTheDocument();
    expect(screen.getByText('Past event description')).toBeInTheDocument();
    expect(document.querySelector('.event-card')).toHaveClass('event-card-hero', 'event-card-compact', 'past-event');
    expect(screen.queryByRole('button', { name: 'Add to Calendar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /RSVP on Meetup/ })).not.toBeInTheDocument();
  });
}); 