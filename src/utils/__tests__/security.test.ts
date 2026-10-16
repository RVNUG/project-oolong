import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CONTACT_CATEGORIES,
  isBotSubmission,
  isInputSuspicious,
  isRateLimited,
  isSubmittingTooQuickly,
  isValidContactCategory,
  isValidEmail,
  isValidName,
  sanitizeFormData,
  sanitizeInput,
  validateFormData,
} from '../security';

describe('security utilities', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('sanitizeInput', () => {
    it('removes markup delimiters, escapes special characters, and trims whitespace', () => {
      expect(sanitizeInput('  <b>A & "B" \'C\'</b>  ')).toBe(
        'bA &amp; &quot;B&quot; &#x27;C&#x27;/b'
      );
    });
  });

  describe('validators', () => {
    it('validates email format and maximum length', () => {
      expect(isValidEmail('person+tag@example.com')).toBe(true);
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail(`${'a'.repeat(243)}@example.com`)).toBe(false);
    });

    it('validates names with supported separators and length limits', () => {
      expect(isValidName("Anne-Marie O'Neil")).toBe(true);
      expect(isValidName('A')).toBe(false);
      expect(isValidName('Name2')).toBe(false);
      expect(isValidName('N'.repeat(101))).toBe(false);
    });

    it.each([
      '<script>alert(1)</script>',
      'javascript:alert(1)',
      'onclick=alert(1)',
      'SELECT name FROM users',
      'UNION SELECT password',
      'INSERT INTO users',
      'DROP TABLE users',
      'ALTER TABLE users',
      'DELETE FROM users',
      'eval(alert(1))',
      'document.cookie',
      'window.location',
      'execCommand("copy")',
    ])('detects suspicious input: %s', value => {
      expect(isInputSuspicious(value)).toBe(true);
    });

    it('accepts ordinary text as non-suspicious', () => {
      expect(isInputSuspicious('Please add a calendar export option')).toBe(false);
    });

    it('accepts only configured contact categories', () => {
      for (const category of CONTACT_CATEGORIES) {
        expect(isValidContactCategory(category)).toBe(true);
        expect(validateFormData('', '', category, 'A sufficiently long message')).toEqual([]);
      }
      expect(isValidContactCategory('unknown')).toBe(false);
    });
  });

  describe('sanitizeFormData', () => {
    it('sanitizes every field in a normal submission', () => {
      expect(sanitizeFormData({
        name: ' Pat ',
        email: 'pat@example.com',
        category: 'feedback',
        message: '  Please add this feature.  ',
      })).toEqual({
        name: 'Pat',
        email: 'pat@example.com',
        category: 'feedback',
        message: 'Please add this feature.',
      });
    });

    it('logs and sanitizes suspicious fields', () => {
      vi.useFakeTimers();
      vi.stubEnv('NODE_ENV', 'development');
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const sanitized = sanitizeFormData({
        name: 'Pat',
        email: 'pat@example.com',
        category: 'feedback',
        message: '<script>bad()</script>',
      });

      expect(sanitized.message).toBe('scriptbad()/script');
      expect(warn).toHaveBeenCalledWith('Security Event: suspicious_input', {
        fields: ['message'],
      });
    });
  });

  describe('validateFormData', () => {
    it('accepts a valid submission with optional name and email omitted', () => {
      expect(validateFormData('', '', 'feedback', 'A sufficiently long message')).toEqual([]);
    });

    it('reports required fields and invalid category', () => {
      expect(validateFormData('', '', '', '')).toEqual([
        'Please select a category',
        'Message is required',
      ]);
      expect(validateFormData('', '', 'invalid', 'A sufficiently long message')).toEqual([
        'Please select a valid category',
      ]);
    });

    it('reports name, email, and message format and length errors', () => {
      expect(validateFormData('A', 'invalid', 'feedback', 'short')).toEqual([
        'Name must be at least 2 characters long',
        'Please enter a valid email address',
        'Message must be at least 10 characters long',
      ]);
      expect(validateFormData(
        'N'.repeat(101),
        `${'a'.repeat(243)}@example.com`,
        'feedback',
        'M'.repeat(3001)
      )).toEqual([
        'Name must be no more than 100 characters long',
        'Email must be no more than 254 characters long',
        'Message must be no more than 3000 characters long',
      ]);
      expect(validateFormData('Pat2', '', 'feedback', 'A sufficiently long message')).toEqual([
        'Name can only contain letters, with spaces, hyphens, or apostrophes between words',
      ]);
    });
  });

  describe('bot and rate-limit checks', () => {
    it('detects a filled honeypot and accepts an empty one', () => {
      expect(isBotSubmission('hidden value')).toBe(true);
      expect(isBotSubmission('')).toBe(false);
    });

    it('limits repeated submissions and resets after the time window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

      for (let attempt = 0; attempt < 5; attempt++) {
        expect(isRateLimited()).toBe(false);
      }
      expect(isRateLimited()).toBe(true);

      vi.advanceTimersByTime(5 * 60 * 1000 + 1);
      expect(isRateLimited()).toBe(false);
    });

    it('detects submissions that arrive before the minimum gap', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:10Z'));

      expect(isSubmittingTooQuickly(Date.now() - 500, 1000)).toBe(true);
      expect(isSubmittingTooQuickly(Date.now() - 1500, 1000)).toBe(false);
      expect(isSubmittingTooQuickly(0, 1000)).toBe(false);
    });
  });
});