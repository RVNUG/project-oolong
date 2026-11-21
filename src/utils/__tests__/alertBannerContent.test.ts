import { describe, it, expect } from 'vitest';
import { buildHolidayMeetupAlertBannerProps } from '../alertBannerContent';
import { MeetupEvent } from '../../types';

const holidayMeetup: MeetupEvent = {
  id: 'e-317304849',
  name: 'In Person-Roanoke: December Meetup at Buffalo Wild Wings near Valley View Mall',
  local_date: '2026-12-03',
  local_time: '18:00',
  description: 'December meetup',
  link: 'https://www.meetup.com/roanoke-valley-net-user-group/events/317304849/',
  is_online: false,
  is_upcoming: true,
  venue: {
    name: 'Buffalo Wild Wings near Valley View Mall',
    address_1: '4869 Valley View Blvd NW',
    city: 'Roanoke',
    state: 'VA',
    country: 'us',
    zip: ''
  }
};

describe('buildHolidayMeetupAlertBannerProps', () => {
  it('maps Meetup event fields to holiday banner props', () => {
    const props = buildHolidayMeetupAlertBannerProps(holidayMeetup);

    expect(props.variant).toBe('holiday');
    expect(props.badge).toBe('Holiday meetup');
    expect(props.title).toContain('Buffalo Wild Wings near Valley View Mall');
    expect(props.details).toEqual(
      expect.arrayContaining(['Thursday, December 3, 2026', '6:00 PM'])
    );
    expect(props.primaryAction).toEqual({
      label: 'Event details',
      to: '/event/e-317304849'
    });
    expect(props.secondaryAction?.href).toBe(holidayMeetup.link);
  });
});