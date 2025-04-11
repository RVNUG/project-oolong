import { describe, it, expect } from 'vitest';
import { 
  formatFullDate, 
  formatTime, 
  formatMeetupDateTime,
  formatShortDate,
  getMonthAbbr
} from '../dateFormatters';

describe('Date Formatter Utils', () => {
  describe('formatFullDate', () => {
    it('should format a valid date string', () => {
      const result = formatFullDate('2025-04-26');
      // We need to account for locale differences in testing
      expect(result).toContain('April 26, 2025');
    });

    it('should handle invalid date strings', () => {
      const result = formatFullDate('invalid-date');
      expect(result).toBe('Date not available');
    });

    it('should format dates from Meetup events.json format correctly', () => {
      // Test with exact format from events.json
      const result = formatFullDate('2025-05-01');
      expect(result).toContain('May 1, 2025');
    });
  });

  describe('formatTime', () => {
    it('should format a valid time string in HH:MM format', () => {
      const result = formatTime('10:00');
      // Format should convert to AM/PM format
      expect(result).toBe('10:00 AM');
    });

    it('should format PM times correctly', () => {
      const result = formatTime('18:00');
      expect(result).toBe('6:00 PM');
    });

    it('should handle time edge cases', () => {
      expect(formatTime('00:00')).toBe('12:00 AM');
      expect(formatTime('12:00')).toBe('12:00 PM');
      expect(formatTime('23:59')).toBe('11:59 PM');
    });

    it('should return the original string if unable to parse', () => {
      expect(formatTime('not-a-time')).toBe('not-a-time');
    });

    it('should handle undefined and null', () => {
      expect(formatTime(undefined)).toBe('Time not available');
      expect(formatTime(null as any)).toBe('Time not available');
    });

    it('should format times from Meetup events.json correctly', () => {
      // Test with exact formats from events.json
      expect(formatTime('10:00')).toBe('10:00 AM'); // Morning event
      expect(formatTime('18:00')).toBe('6:00 PM');  // Evening event
    });
  });

  describe('formatMeetupDateTime', () => {
    it('should combine date and time strings into a valid Date object', () => {
      const date = formatMeetupDateTime('2025-04-26', '10:00');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(3); // April is 3 (0-indexed)
      expect(date.getDate()).toBe(26);
      expect(date.getHours()).toBe(10);
      expect(date.getMinutes()).toBe(0);
    });

    it('should handle dates from events.json correctly', () => {
      // Test with first event from events.json
      const date = formatMeetupDateTime('2025-04-26', '10:00');
      
      // Instead of checking exact ISO string (which includes timezone), 
      // check individual components
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(3); // 0-indexed, so April is 3
      expect(date.getDate()).toBe(26);
      expect(date.getHours()).toBe(10);
      expect(date.getMinutes()).toBe(0);
      
      // Test with second event from events.json
      const date2 = formatMeetupDateTime('2025-05-01', '18:00');
      expect(date2.getFullYear()).toBe(2025);
      expect(date2.getMonth()).toBe(4); // 0-indexed, so May is 4
      expect(date2.getDate()).toBe(1);
      expect(date2.getHours()).toBe(18);
      expect(date2.getMinutes()).toBe(0);
    });
  });

  // Include minimal tests for other formatter functions
  describe('Other formatter functions', () => {
    it('should format a short date', () => {
      // Create date with explicit components to avoid timezone issues
      const date = new Date(2025, 3, 26); // Month is 0-indexed
      const result = formatShortDate(date);
      
      // Check that the formatted date contains the expected parts
      expect(result).toContain('Apr');
      expect(result).toContain('26');
      expect(result).toContain('2025');
    });

    it('should get month abbreviation', () => {
      const date = new Date(2025, 3, 26); // Month is 0-indexed
      expect(getMonthAbbr(date)).toBe('Apr');
    });
  });
}); 