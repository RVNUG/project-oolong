# Contact Form Security Documentation

This document provides a comprehensive overview of the security measures implemented in the RVNUG contact form to protect against common web vulnerabilities and ensure a secure user experience.

## Table of Contents

1. [Overview](#overview)
2. [Input Validation & Sanitization](#input-validation--sanitization)
3. [Bot Protection](#bot-protection)
4. [Rate Limiting](#rate-limiting)
5. [User Feedback & Accessibility](#user-feedback--accessibility)
6. [Anti-Timing Attack Measures](#anti-timing-attack-measures)
7. [Logging & Monitoring](#logging--monitoring)
8. [Implementation Details](#implementation-details)
9. [Security Best Practices](#security-best-practices)

## Overview

The contact form security system employs a multi-layered approach to security, combining frontend and backend protections to create defense in depth. Key security features include:

- Client-side and server-side validation
- XSS protection through input sanitization
- Bot detection mechanisms
- Rate limiting and submission throttling
- Suspicious pattern detection
- Accessible error messaging
- Logging and monitoring capabilities

## Input Validation & Sanitization

### Validation Strategy

The form implements validation at multiple levels:

1. **HTML5 Validation Attributes**: Required fields, min/max length, pattern constraints
2. **Real-time Validation on Blur**: Immediate feedback as users complete fields
3. **Comprehensive Form Validation Before Submission**: Final validation check

### Sanitization Approach

To prevent Cross-Site Scripting (XSS) and injection attacks:

- Sanitization occurs at submission time only (not during typing)
- The `sanitizeInput()` function removes potentially dangerous characters
- All user inputs are sanitized before being used in the `mailto:` URL
- Proper `encodeURIComponent()` is used for URL parameters

### Validation Rules

| Field   | Pattern                                | Min Length | Max Length | Validation                                         |
|---------|----------------------------------------|------------|------------|---------------------------------------------------|
| Name    | `/^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/`   | 2          | 100        | Letters with spaces, hyphens, apostrophes between |
| Email   | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | 1      | 254        | RFC 5321 compliant email format                    |
| Subject | Dropdown selection                     | 1          | 150        | Required selection                                 |
| Message | Any text                               | 10         | 3000       | Length validation only                             |

## Bot Protection

Multiple mechanisms detect and prevent automated submissions:

### Honeypot Field

- Invisible field added that only bots would complete
- Implementation with CSS hiding and ARIA attributes for accessibility
- No visual indication of rejection to avoid tipping off attackers

```html
<input
  type="text"
  name="website"
  value={honeypot}
  onChange={handleHoneypotChange}
  style={{ opacity: 0, position: 'absolute', height: 0 }}
  tabIndex={-1}
  aria-hidden="true"
  autoComplete="off"
/>
```

### Timing Analysis

- Tracks form load time (`formStartTime`)
- Flags suspiciously fast submissions (< 1.5 seconds as likely bots)
- Implements minimum time between submissions (2 seconds)
- Silently ignores suspected bot submissions

## Rate Limiting

### Client-Side Rate Limiting

- Tracks submission attempts in memory
- Limits to 5 submissions within a 5-minute window
- Visual feedback when rate limited
- Automatic reset after timeout period

### Implementation Details

```typescript
// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  timeWindow: 5 * 60 * 1000, // 5 minutes
  minDelay: 100,
  maxDelay: 500,
};
```

When rate limit is exceeded:
- Form is disabled
- Visual indicator is shown
- Timer is set to re-enable the form

## User Feedback & Accessibility

### Accessible Error Messages

- All error messages have `role="alert"` for screen readers
- Specific error descriptions per validation type
- Form-level and field-level error messages

### Visual Feedback

- Red border indicates invalid fields
- Error messages positioned directly below relevant fields 
- Animations for rate limiting warnings
- Disabled form elements have visual state changes

### CSS Implementation

```css
/* Security animation for rate-limited state */
@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(220, 38, 38, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
}

.error-message[role="alert"] {
  animation: pulse-border 2s infinite;
}
```

## Anti-Timing Attack Measures

To prevent timing-based attacks:

### Random Delays

- Added random delays (100-500ms) after suspicious inputs
- Varies response times to prevent timing analysis
- Implementation:

```typescript
const addRandomDelay = async (): Promise<void> => {
  const delay = Math.floor(
    Math.random() * (RATE_LIMIT.maxDelay - RATE_LIMIT.minDelay + 1)
  ) + RATE_LIMIT.minDelay;
  
  return new Promise(resolve => setTimeout(resolve, delay));
};
```

## Logging & Monitoring

The security system includes logging capabilities:

### Security Event Logging

- Logs suspicious input patterns
- Tracks rate limiting triggers
- Records honeypot activations
- Logs rapid submission attempts

```typescript
const logSecurityEvent = (event: string, details: Record<string, any>): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Security Event: ${event}`, details);
  }
  // In production, this would send to a logging service
};
```

## Implementation Details

### Suspicious Pattern Detection

The system detects and logs common attack patterns:

```typescript
const suspiciousPatterns = [
  /<script/i,
  /javascript:/i,
  /on\w+=/i, // onclick, onload, etc.
  /SELECT.*FROM/i,
  /UNION.*SELECT/i,
  /INSERT.*INTO/i,
  /DROP.*TABLE/i,
  /ALTER.*TABLE/i,
  /DELETE.*FROM/i,
  /eval\(/i,
  /document\.cookie/i,
  /window\.location/i,
  /execCommand/i,
];
```

### Rate Limiting Implementation Notes

Current rate limiting is session-based, implemented on the client-side:

```typescript
// Storage for rate limiting (would be in redis/db in production)
let attempts = 0;
let firstAttemptTime: number | null = null;
// Note: IP-based rate limiting would be implemented server-side
```

A more robust IP-based rate limiting implementation would require server-side code, as noted in the Future Enhancements section.

### Environment Variable Safety

- Fallback values for environment variables
- Prevents undefined issues when env vars are missing:

```typescript
const DISCORD_URL = import.meta.env.VITE_APP_DISCORD_URL || 'https://discord.gg/rvnug';
```

## Security Best Practices

### For Developers

When working with this contact form:

1. **Don't modify security validations** without thorough testing
2. **Don't remove sanitization** even if it seems redundant
3. **Keep environment variables updated** in all environments
4. **Test thoroughly** after any changes to form validation or submission

### Future Enhancements

Potential security improvements to consider:

1. **Server-side implementation**: Move to a server-based submission for better security
2. **CAPTCHA Integration**: Add Google reCAPTCHA or similar service for enhanced bot protection
3. **IP-based rate limiting**: Currently simulated, but could be implemented with server
4. **Web Application Firewall (WAF)**: Consider implementing a WAF for additional protection
5. **CSRF Protection**: Add if form is moved to a server-side implementation

---

*Last Updated: May 2024*

*Maintained by: RVNUG Team* 