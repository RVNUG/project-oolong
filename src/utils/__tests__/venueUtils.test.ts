import { describe, it, expect } from 'vitest';
import { formatVenueAddress, isEventOnline } from '../venueUtils';
import { MeetupEvent } from '../../types';

describe('Venue Utilities', () => {
  describe('formatVenueAddress', () => {
    it('should return empty string for online events', () => {
      const venue = {
        name: 'Some Place',
        address_1: '123 Main St',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, true)).toBe('');
    });

    it('should return empty string for undefined venue', () => {
      expect(formatVenueAddress(undefined, false)).toBe('');
    });

    it('should format address when address_1 is the same as city, state', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: 'Roanoke, VA',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('Roanoke, VA 24016');
    });

    it('should format address when address_1 is the same as city, state with extra spaces', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: 'Roanoke,  VA',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('Roanoke, VA 24016');
    });

    it('should format a complete address when all fields are present', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: '123 Main St',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('123 Main St, Roanoke, VA 24016');
    });

    it('should handle empty address_1 gracefully', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: '',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('Roanoke, VA 24016');
    });

    it('should handle missing city gracefully', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: '123 Main St',
        city: '',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('123 Main St, VA 24016');
    });

    it('should handle missing state gracefully', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: '123 Main St',
        city: 'Roanoke',
        state: '',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('123 Main St, Roanoke 24016');
    });

    it('should handle missing zip gracefully', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: '123 Main St',
        city: 'Roanoke',
        state: 'VA',
        country: 'us',
        zip: ''
      };
      expect(formatVenueAddress(venue, false)).toBe('123 Main St, Roanoke, VA');
    });

    it('should handle multiple missing fields gracefully', () => {
      const venue = {
        name: 'Mill Mountain Coffee',
        address_1: '',
        city: '',
        state: 'VA',
        country: 'us',
        zip: '24016'
      };
      expect(formatVenueAddress(venue, false)).toBe('VA 24016');
    });
  });

  describe('isEventOnline', () => {
    it('should return true for events with is_online flag', () => {
      const event = {
        id: 'e-1',
        name: 'Online Meeting',
        is_online: true,
        venue: {
          name: 'Some Place',
          address_1: '123 Main St',
          city: 'Roanoke',
          state: 'VA',
          country: 'us',
          zip: '24016'
        }
      } as MeetupEvent;
      
      expect(isEventOnline(event)).toBe(true);
    });

    it('should return true for events with "Online Event" venue name', () => {
      const event = {
        id: 'e-1',
        name: 'Online Meeting',
        is_online: false,
        venue: {
          name: 'Online Event',
          address_1: '',
          city: '',
          state: '',
          country: 'us',
          zip: ''
        }
      } as MeetupEvent;
      
      expect(isEventOnline(event)).toBe(true);
    });

    it('should return false for in-person events', () => {
      const event = {
        id: 'e-1',
        name: 'In-Person Meeting',
        is_online: false,
        venue: {
          name: 'Mill Mountain Coffee',
          address_1: '123 Main St',
          city: 'Roanoke',
          state: 'VA',
          country: 'us',
          zip: '24016'
        }
      } as MeetupEvent;
      
      expect(isEventOnline(event)).toBe(false);
    });
  });
}); 