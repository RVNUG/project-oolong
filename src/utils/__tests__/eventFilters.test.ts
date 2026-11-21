import { describe, it, expect } from 'vitest';
import {
  cleanMeetupEventName,
  getFeaturedHolidayMeetup,
  getLatestPastTalk,
  isCodeAndCoffeeEvent
} from '../eventFilters';
import { MeetupEvent } from '../../types';

const event = (overrides: Partial<MeetupEvent>): MeetupEvent => ({
  id: '1',
  name: 'Test',
  local_date: '2026-01-01',
  local_time: '18:00',
  description: '',
  link: 'https://example.com',
  is_online: false,
  is_upcoming: false,
  ...overrides
});

describe('eventFilters', () => {
  describe('isCodeAndCoffeeEvent', () => {
    it('matches Code & Coffee and Code and Coffee titles', () => {
      expect(isCodeAndCoffeeEvent(event({ name: 'In Person: Code & Coffee, Saturday, July 25th' }))).toBe(true);
      expect(isCodeAndCoffeeEvent(event({ name: 'In Person: Code and Coffee on May 16th from 10am-1pm ET' }))).toBe(true);
    });

    it('does not match presentation meetups', () => {
      expect(isCodeAndCoffeeEvent(event({ name: 'In Person-Salem: presentation by David Bates' }))).toBe(false);
    });
  });

  describe('getLatestPastTalk', () => {
    it('returns newest past talk, skipping Code & Coffee but allowing online', () => {
      const past = [
        event({ id: 'coffee', name: 'In Person: Code & Coffee, Saturday, June 20th', local_date: '2026-06-20' }),
        event({
          id: 'online',
          name: 'Online: The 1-Person DevOps Stack presentation by Lionel Sapp',
          local_date: '2026-06-10',
          is_online: true
        }),
        event({ id: 'talk', name: 'In Person-Salem: presentation by David Bates', local_date: '2026-06-04' })
      ];

      expect(getLatestPastTalk(past)?.id).toBe('online');
    });

    it('returns undefined when only Code & Coffee events exist', () => {
      expect(
        getLatestPastTalk([
          event({ name: 'In Person: Code & Coffee', is_online: false })
        ])
      ).toBeUndefined();
    });
  });

  describe('cleanMeetupEventName', () => {
    it('strips mode prefix and embedded date/time', () => {
      expect(
        cleanMeetupEventName('In Person: Code and Coffee on July 25th from 10am-1pm ET')
      ).toBe('Code and Coffee');
    });
  });

  describe('getFeaturedHolidayMeetup', () => {
    const holidayMeetup = event({
      id: 'e-317304849',
      name: 'In Person-Roanoke: December Meetup at Buffalo Wild Wings near Valley View Mall',
      local_date: '2026-12-03',
      local_time: '18:00',
      is_upcoming: true,
      venue: {
        name: 'Buffalo Wild Wings near Valley View Mall',
        address_1: '4869 Valley View Blvd NW',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: ''
      }
    });

    it('finds the meetup by known id', () => {
      expect(getFeaturedHolidayMeetup([event({ id: 'other' }), holidayMeetup])?.id).toBe(
        'e-317304849'
      );
    });

    it('finds the meetup by date and venue when id differs', () => {
      const alt = { ...holidayMeetup, id: 'e-alt' };
      expect(getFeaturedHolidayMeetup([alt])?.id).toBe('e-alt');
    });

    it('returns undefined when no matching event', () => {
      expect(getFeaturedHolidayMeetup([event({ id: 'coffee', name: 'Code & Coffee' })])).toBeUndefined();
    });
  });
});
