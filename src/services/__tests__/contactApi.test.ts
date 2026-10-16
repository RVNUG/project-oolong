import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitContact } from '../contactApi';

const payload = { category: 'feedback' as const, message: 'Please add a calendar export.' };
const fetchMock = vi.fn();

describe('contactApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('VITE_GITHUB_DISPATCH_TOKEN', 'test-token');
    vi.stubEnv('VITE_GITHUB_REPO', 'rvnug/project-oolong');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('rejects missing credentials or an invalid repository before making a request', async () => {
    vi.stubEnv('VITE_GITHUB_DISPATCH_TOKEN', '  ');
    await expect(submitContact(payload)).rejects.toThrow(
      'Contact form is not configured. Please email officers@rvnug.org.'
    );

    vi.stubEnv('VITE_GITHUB_DISPATCH_TOKEN', 'test-token');
    vi.stubEnv('VITE_GITHUB_REPO', 'invalid-repo');
    await expect(submitContact(payload)).rejects.toThrow(
      'Contact form is not configured correctly. Please email officers@rvnug.org.'
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts the minimal issue payload and accepts GitHub success responses', async () => {
    fetchMock.mockResolvedValueOnce({ status: 204, ok: false });
    await expect(submitContact(payload)).resolves.toBeUndefined();

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.github.com/repos/rvnug/project-oolong/dispatches');
    expect(request.method).toBe('POST');
    expect((request.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
    const body = JSON.parse(String(request.body));
    expect(body).toMatchObject({
      event_type: 'contact-form',
      client_payload: { category: 'feedback', message: payload.message },
    });
    expect(body.client_payload).not.toHaveProperty('name');
    expect(body.client_payload).not.toHaveProperty('email');
    expect(body.client_payload.submitted_at).toEqual(expect.any(String));

    fetchMock.mockResolvedValueOnce({ status: 200, ok: true });
    await expect(submitContact(payload)).resolves.toBeUndefined();
  });

  it('prefers a message returned by GitHub', async () => {
    fetchMock.mockResolvedValue({
      status: 422,
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Dispatch rejected' }),
    });

    await expect(submitContact(payload)).rejects.toThrow('Dispatch rejected');
  });

  it.each([
    [401, 'Contact form is not configured correctly. Please email officers@rvnug.org.'],
    [403, 'Contact form is not configured correctly. Please email officers@rvnug.org.'],
    [404, 'Contact form is unavailable. Please email officers@rvnug.org.'],
    [429, 'Too many requests. Please try again in a few minutes.'],
    [500, 'Could not send your message. Please try again or email officers@rvnug.org.'],
  ])('maps HTTP %i failures to a useful error', async (status, message) => {
    fetchMock.mockResolvedValue({
      status,
      ok: false,
      json: vi.fn().mockRejectedValue(new Error('No JSON body')),
    });

    await expect(submitContact(payload)).rejects.toThrow(message);
  });
});