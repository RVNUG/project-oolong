import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactPage from '../ContactPage';

const security = vi.hoisted(() => ({
  validateFormData: vi.fn(),
  isValidName: vi.fn(),
  isValidEmail: vi.fn(),
  isValidContactCategory: vi.fn(),
  sanitizeFormData: vi.fn(),
  isRateLimited: vi.fn(),
  isBotSubmission: vi.fn(),
  isSubmittingTooQuickly: vi.fn(),
}));
const contactApi = vi.hoisted(() => ({ submitContact: vi.fn() }));

vi.mock('../../utils/security', () => security);
vi.mock('../../services/contactApi', () => ({
  submitContact: contactApi.submitContact,
  EMAIL_ONLY_CATEGORIES: ['sponsorship', 'speaking', 'volunteer', 'other'],
  ISSUE_CATEGORIES: ['feedback', 'feature-request', 'bug'],
  OPENS_MAILTO_CATEGORIES: ['sponsorship', 'speaking', 'volunteer', 'other'],
}));
vi.mock('../../components/SEO', () => ({ default: () => null }));
vi.mock('../../components/JsonLd', () => ({ default: () => null }));

const renderContactPage = () => render(
  <MemoryRouter initialEntries={['/contact']}>
    <ContactPage />
  </MemoryRouter>
);

const submitForm = async () => {
  await act(async () => {
    const form = screen.getByRole('button', { name: 'Send Message' }).closest('form');
    if (!form) throw new Error('Contact form was not rendered');
    fireEvent.submit(form);
    await Promise.resolve();
  });
};

const getHoneypotInput = () => {
  const input = document.querySelector<HTMLInputElement>('input[name="website"]');
  if (!input) throw new Error('Honeypot input was not rendered');
  return input;
};

describe('ContactPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    security.validateFormData.mockReturnValue([]);
    security.isValidName.mockReturnValue(true);
    security.isValidEmail.mockReturnValue(true);
    security.isValidContactCategory.mockImplementation((category: string) => [
      'feedback', 'feature-request', 'bug', 'sponsorship', 'speaking', 'volunteer', 'other',
    ].includes(category));
    security.sanitizeFormData.mockImplementation((data: unknown) => data);
    security.isRateLimited.mockReturnValue(false);
    security.isBotSubmission.mockReturnValue(false);
    security.isSubmittingTooQuickly.mockReturnValue(false);
    contactApi.submitContact.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows name and email only for email categories and clears them for issue categories', () => {
    renderContactPage();
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Your Email')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'sponsorship' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Taylor' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'taylor@example.com' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'bug' } });

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Your Email')).not.toBeInTheDocument();
  });

  it('validates individual fields on blur and displays form-level errors on submit', async () => {
    renderContactPage();
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'sponsorship' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Taylor2' } });
    security.isValidName.mockReturnValueOnce(false);
    fireEvent.blur(screen.getByLabelText('Name'));
    expect(screen.getByText('Name can only contain letters, with spaces, hyphens, or apostrophes between words')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'invalid' } });
    security.isValidEmail.mockReturnValueOnce(false);
    fireEvent.blur(screen.getByLabelText('Your Email'));
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'short' } });
    fireEvent.blur(screen.getByLabelText('Message'));
    expect(screen.getByText('Message must be at least 10 characters long')).toBeInTheDocument();

    security.validateFormData.mockReturnValueOnce(['Message is required']);
    vi.advanceTimersByTime(1600);
    await submitForm();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
    expect(contactApi.submitContact).not.toHaveBeenCalled();
  });

  it('silently ignores honeypot submissions and rejects rapid submissions', async () => {
    renderContactPage();
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'bug' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'A sufficiently long message' } });
    fireEvent.change(getHoneypotInput(), { target: { value: 'bot-filled' } });
    security.isBotSubmission.mockReturnValueOnce(true);
    vi.advanceTimersByTime(1600);
    await submitForm();
    expect(contactApi.submitContact).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.change(getHoneypotInput(), { target: { value: '' } });
    security.isSubmittingTooQuickly.mockReturnValueOnce(true);
    await submitForm();
    expect(screen.getByRole('alert')).toHaveTextContent('Please wait a moment before submitting again.');
  });

  it('shows rate-limit status and disables form controls', async () => {
    renderContactPage();
    security.isRateLimited.mockReturnValueOnce(true);
    vi.advanceTimersByTime(1600);

    await submitForm();

    expect(screen.getByText('Rate limit exceeded. Please try again in a few minutes.')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeDisabled();
  });

  it('submits issue categories without name or email and reports success', async () => {
    renderContactPage();
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'bug' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'A sufficiently long bug report' } });
    vi.advanceTimersByTime(1600);

    await submitForm();

    expect(contactApi.submitContact).toHaveBeenCalledWith({
      category: 'bug',
      message: 'A sufficiently long bug report',
    });
    expect(screen.getByRole('status')).toHaveTextContent('Thanks — we received your message.');
    expect(screen.getByLabelText('Category')).toHaveValue('feedback');
    expect(screen.getByLabelText('Message')).toHaveValue('');
  });

  it('shows submission errors and clears success after edits', async () => {
    renderContactPage();
    contactApi.submitContact.mockRejectedValueOnce(new Error('GitHub unavailable'));
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'feedback' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'A sufficiently long bug report' } });
    vi.advanceTimersByTime(1600);

    await submitForm();
    expect(screen.getByRole('alert')).toHaveTextContent('GitHub unavailable');

    contactApi.submitContact.mockResolvedValueOnce(undefined);
    vi.advanceTimersByTime(1600);
    await submitForm();
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Changed the message' } });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});