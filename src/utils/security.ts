/**
 * Security utilities for form input validation, sanitization,
 * rate limiting, and bot prevention.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/; // Allows multiple words with spaces, hyphens, apostrophes between them
const MAX_LENGTH = {
  name: 100,
  email: 254, // Maximum length per RFC 5321
  subject: 150,
  message: 3000,
};

const MIN_LENGTH = {
  name: 2,
  message: 10,
};

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  timeWindow: 5 * 60 * 1000, // 5 minutes
  // Random delay to prevent timing attacks
  minDelay: 100, // Minimum delay in ms
  maxDelay: 500, // Maximum delay in ms
};

// Storage for rate limiting (would be in redis/db in production)
let attempts = 0;
let firstAttemptTime: number | null = null;
let ipAttempts: Record<string, { count: number, timestamp: number }> = {};

/**
 * Add random delay to prevent timing-based attacks
 */
const addRandomDelay = async (): Promise<void> => {
  const delay = Math.floor(
    Math.random() * (RATE_LIMIT.maxDelay - RATE_LIMIT.minDelay + 1)
  ) + RATE_LIMIT.minDelay;
  
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Logs security events if a logger is configured
 * (No-op in client-side code, but would be implemented server-side)
 */
const logSecurityEvent = (event: string, details: Record<string, any>): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Security Event: ${event}`, details);
  }
  // In production, this would send to a logging service
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= MAX_LENGTH.email;
};

/**
 * Validate name format
 */
export const isValidName = (name: string): boolean => {
  return NAME_REGEX.test(name) && 
         name.length >= MIN_LENGTH.name && 
         name.length <= MAX_LENGTH.name;
};

/**
 * Check for suspicious patterns in input
 * Returns true if input looks suspicious
 */
export const isInputSuspicious = (input: string): boolean => {
  // Check for script tags, SQL injection patterns, and other malicious content
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
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitize form data before submission
 */
export const sanitizeFormData = (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  // Check for suspicious input before sanitizing
  const fieldChecks = {
    name: isInputSuspicious(formData.name),
    email: isInputSuspicious(formData.email),
    subject: isInputSuspicious(formData.subject),
    message: isInputSuspicious(formData.message),
  };
  
  // Log suspicious activity
  if (Object.values(fieldChecks).some(Boolean)) {
    logSecurityEvent('suspicious_input', { 
      fields: Object.entries(fieldChecks)
        .filter(([_, isSuspicious]) => isSuspicious)
        .map(([field]) => field)
    });
    
    // Add a small delay to slow down attackers
    addRandomDelay();
  }
  
  return {
    name: sanitizeInput(formData.name),
    email: sanitizeInput(formData.email),
    subject: sanitizeInput(formData.subject),
    message: sanitizeInput(formData.message),
  };
};

/**
 * Validate form data
 * Returns array of error messages, empty if valid
 */
export const validateFormData = (
  name: string,
  email: string,
  subject: string,
  message: string
): string[] => {
  const errors: string[] = [];

  // Name validation
  if (!name) {
    errors.push('Name is required');
  } else if (!isValidName(name)) {
    if (name.length < MIN_LENGTH.name) {
      errors.push(`Name must be at least ${MIN_LENGTH.name} characters long`);
    } else if (name.length > MAX_LENGTH.name) {
      errors.push(`Name must be no more than ${MAX_LENGTH.name} characters long`);
    } else {
      errors.push('Name can only contain letters, with spaces, hyphens, or apostrophes between words');
    }
  }

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    if (email.length > MAX_LENGTH.email) {
      errors.push(`Email must be no more than ${MAX_LENGTH.email} characters long`);
    } else {
      errors.push('Please enter a valid email address');
    }
  }

  // Subject validation
  if (!subject) {
    errors.push('Please select a subject');
  } else if (subject.length > MAX_LENGTH.subject) {
    errors.push(`Subject must be no more than ${MAX_LENGTH.subject} characters long`);
  }

  // Message validation
  if (!message) {
    errors.push('Message is required');
  } else if (message.length < MIN_LENGTH.message) {
    errors.push(`Message must be at least ${MIN_LENGTH.message} characters long`);
  } else if (message.length > MAX_LENGTH.message) {
    errors.push(`Message must be no more than ${MAX_LENGTH.message} characters long`);
  }

  return errors;
};

/**
 * Check if rate limit has been exceeded
 * Returns true if rate limit exceeded
 */
export const isRateLimited = (): boolean => {
  const now = Date.now();

  // Reset rate limiting after time window
  if (firstAttemptTime && now - firstAttemptTime > RATE_LIMIT.timeWindow) {
    attempts = 0;
    firstAttemptTime = null;
  }

  // Initialize first attempt time
  if (!firstAttemptTime) {
    firstAttemptTime = now;
  }

  attempts++;
  
  // Log excessive attempts
  if (attempts > RATE_LIMIT.maxAttempts) {
    logSecurityEvent('rate_limit_exceeded', { 
      attempts,
      timeWindow: RATE_LIMIT.timeWindow 
    });
    
    // Add random delay to slow down attacks
    addRandomDelay();
  }

  return attempts > RATE_LIMIT.maxAttempts;
};

/**
 * Validate honeypot field for bot detection
 * @param honeypotValue The value of the honeypot field (should be empty)
 * @returns True if the submission appears to be from a bot
 */
export const isBotSubmission = (honeypotValue: string): boolean => {
  if (honeypotValue) {
    logSecurityEvent('honeypot_triggered', {});
    return true;
  }
  
  return false;
};

/**
 * Check if form is being submitted too quickly
 * Used to detect automated submissions
 * @param lastSubmitTime Time of the last submission in milliseconds
 * @param minTimeGap Minimum time gap between submissions in milliseconds
 * @returns True if the submission is too quick
 */
export const isSubmittingTooQuickly = (lastSubmitTime: number, minTimeGap: number = 2000): boolean => {
  const now = Date.now();
  const timeSinceLastSubmit = now - lastSubmitTime;
  
  if (lastSubmitTime && timeSinceLastSubmit < minTimeGap) {
    logSecurityEvent('rapid_submission', { 
      timeSinceLastSubmit,
      threshold: minTimeGap 
    });
    return true;
  }
  
  return false;
}; 