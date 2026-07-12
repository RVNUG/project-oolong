import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import {
  validateFormData,
  isValidName,
  isValidEmail,
  isValidContactCategory,
  sanitizeFormData,
  isRateLimited,
  isBotSubmission,
  isSubmittingTooQuickly,
} from '../utils/security';
import {
  submitContact,
  type ContactCategory,
} from '../services/contactApi';
import '../assets/css/contact.css';

// Safety fallback for environment variables
const DISCORD_URL = import.meta.env.VITE_APP_DISCORD_URL || 'https://discord.gg/invite/b4hAu9Pdg5';

const CATEGORY_OPTIONS: { value: ContactCategory; label: string }[] = [
  { value: 'feedback', label: 'Feedback' },
  { value: 'feature-request', label: 'Feature Request' },
  { value: 'bug', label: 'Bug' },
];

// Form validation constants
const MAX_LENGTH = {
  name: 100,
  email: 254,
  message: 3000,
};

const MIN_LENGTH = {
  name: 2,
  message: 10,
};

// Throttling configuration
const SUBMIT_COOLDOWN = 2000; // 2 seconds between submissions

const ContactPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'feedback' as ContactCategory | '',
    message: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Security enhancement states
  const [isLimited, setIsLimited] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [honeypot, setHoneypot] = useState(''); // Bot detection field
  const [formStartTime] = useState<number>(Date.now()); // Track when form was loaded

  // Reset rate limit warning after window expires
  useEffect(() => {
    if (isLimited) {
      const timer = setTimeout(() => {
        setIsLimited(false);
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [isLimited]);

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Contact', url: `${baseUrl}/contact` },
  ]);

  // Validate individual fields on blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'name':
        if (value && !isValidName(value)) {
          error =
            'Name can only contain letters, with spaces, hyphens, or apostrophes between words';
        }
        break;
      case 'email':
        if (value && !isValidEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'category':
        if (!value) {
          error = 'Please select a category';
        } else if (!isValidContactCategory(value)) {
          error = 'Please select a valid category';
        }
        break;
      case 'message':
        if (value && value.length < MIN_LENGTH.message) {
          error = 'Message must be at least 10 characters long';
        } else if (value && value.length > MAX_LENGTH.message) {
          error = `Message must be no more than ${MAX_LENGTH.message} characters`;
        }
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSubmitSuccess(false);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Honeypot handler (invisible to users, only filled by bots)
  const handleHoneypotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoneypot(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitSuccess(false);

    // Bot detection - silently fail if honeypot is filled
    if (isBotSubmission(honeypot)) {
      return;
    }

    // Check for submissions that are too fast (likely bots)
    const formFillTime = Date.now() - formStartTime;
    if (formFillTime < 1500) {
      console.warn('Form submitted suspiciously quickly');
      return;
    }

    // Submission throttling
    if (isSubmittingTooQuickly(lastSubmitTime, SUBMIT_COOLDOWN)) {
      setErrors(['Please wait a moment before submitting again.']);
      return;
    }
    setLastSubmitTime(Date.now());

    // Rate limiting check
    if (isRateLimited()) {
      setErrors(['Too many attempts. Please try again in a few minutes.']);
      setIsLimited(true);
      return;
    }

    // Validate form data
    const validationErrors = validateFormData(
      formData.name,
      formData.email,
      formData.category,
      formData.message
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!isValidContactCategory(formData.category)) {
      setErrors(['Please select a valid category']);
      return;
    }

    const sanitizedData = sanitizeFormData(formData);
    if (!isValidContactCategory(sanitizedData.category)) {
      setErrors(['Please select a valid category']);
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        category: sanitizedData.category,
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
      });
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'feedback',
        message: '',
      });
      setFieldErrors({
        name: '',
        email: '',
        category: '',
        message: '',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Could not send your message. Please try again.';
      setErrors([message]);
    } finally {
      setSubmitting(false);
    }
  };

  const formDisabled = isLimited || submitting;

  return (
    <div className="contact-page">
      <SEO
        title="Contact Us - Roanoke Valley .NET User Group (RVNUG)"
        description="Reach out to the Roanoke Valley .NET User Group. Whether you have questions, want to become a sponsor, or are interested in speaking at one of our events, we'd love to hear from you."
        keywords="contact, get in touch, email, questions, sponsorship, speaking opportunities, feedback"
        pathName={location.pathname}
      />

      <JsonLd data={breadcrumbData} />

      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with the RVNUG team</p>
      </div>

      <div className="contact-content">
        <div className="contact-options">
          <div className="contact-option">
            <i className="fas fa-envelope"></i>
            <h3>Email</h3>
            <p>
              General Inquiries/Sponsorship:{' '}
              <a href="mailto:officers@rvnug.org">officers@rvnug.org</a>
              <br />
            </p>
          </div>

          <div className="contact-option">
            <i className="fab fa-discord"></i>
            <h3>Discord</h3>
            <p>
              Join our Discord server to chat with other members and get real-time
              updates.
            </p>
            <a
              href={DISCORD_URL}
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on Discord
            </a>
          </div>

          <div className="contact-option">
            <i className="fab fa-meetup"></i>
            <h3>Meetup</h3>
            <p>
              Join our Meetup group to stay updated on events and connect with other
              members.
            </p>
            <a
              href="https://www.meetup.com/roanoke-valley-net-user-group/"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join on Meetup
            </a>
          </div>

          <div className="contact-option">
            <i className="fab fa-github"></i>
            <h3>GitHub</h3>
            <p>Check out our code repositories and contribute to our projects.</p>
            <a
              href="https://github.com/rvnug"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <p className="form-info">
            Share feedback, feature ideas, or bugs. Your message opens a GitHub
            issue for the RVNUG team. For sponsorship or speaking, email{' '}
            <a href="mailto:officers@rvnug.org">officers@rvnug.org</a>.
          </p>

          {isLimited && (
            <div className="error-message" role="alert">
              <p>Rate limit exceeded. Please try again in a few minutes.</p>
            </div>
          )}

          {submitSuccess && (
            <div className="success-message" role="status">
              <p>Thanks — we received your message.</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="error-message" role="alert">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* Honeypot field - invisible to humans, catches bots */}
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

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                minLength={MIN_LENGTH.name}
                maxLength={MAX_LENGTH.name}
                pattern="[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*"
                aria-describedby="name-error"
                disabled={formDisabled}
                autoComplete="name"
              />
              {fieldErrors.name && (
                <span className="field-error" id="name-error" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={MAX_LENGTH.email}
                aria-describedby="email-error"
                disabled={formDisabled}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className="field-error" id="email-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-describedby="category-error"
                disabled={formDisabled}
              >
                <option value="">Select a category</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <span className="field-error" id="category-error" role="alert">
                  {fieldErrors.category}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                minLength={MIN_LENGTH.message}
                maxLength={MAX_LENGTH.message}
                aria-describedby="message-error"
                disabled={formDisabled}
                autoComplete="off"
              ></textarea>
              {fieldErrors.message && (
                <span className="field-error" id="message-error" role="alert">
                  {fieldErrors.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={formDisabled}>
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
