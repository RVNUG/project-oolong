/**
 * Submit contact form feedback as a GitHub repository_dispatch event.
 * A workflow creates the issue; the SPA never calls the Issues API directly.
 */

export type ContactCategory = 'feedback' | 'feature-request' | 'bug';

export interface ContactPayload {
  category: ContactCategory;
  name: string;
  email: string;
  message: string;
}

const DEFAULT_REPO = 'rvnug/project-oolong';
const EVENT_TYPE = 'contact-form';

const formatDispatchError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    if (data.message) {
      return data.message;
    }
  } catch {
    // ignore JSON parse errors
  }

  if (response.status === 401 || response.status === 403) {
    return 'Contact form is not configured correctly. Please email officers@rvnug.org.';
  }
  if (response.status === 404) {
    return 'Contact form is unavailable. Please email officers@rvnug.org.';
  }
  if (response.status === 429) {
    return 'Too many requests. Please try again in a few minutes.';
  }
  return 'Could not send your message. Please try again or email officers@rvnug.org.';
};

/**
 * Trigger repository_dispatch so Actions can open a labeled GitHub issue.
 * GitHub returns 204 No Content on success.
 */
export const submitContact = async (payload: ContactPayload): Promise<void> => {
  const token = import.meta.env.VITE_GITHUB_DISPATCH_TOKEN?.trim();
  const repo = (import.meta.env.VITE_GITHUB_REPO || DEFAULT_REPO).trim();

  if (!token) {
    throw new Error(
      'Contact form is not configured. Please email officers@rvnug.org.'
    );
  }

  if (!repo.includes('/')) {
    throw new Error(
      'Contact form is not configured correctly. Please email officers@rvnug.org.'
    );
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: EVENT_TYPE,
        client_payload: {
          category: payload.category,
          name: payload.name,
          email: payload.email,
          message: payload.message,
          submitted_at: new Date().toISOString(),
        },
      }),
    }
  );

  // GitHub returns 204 on successful repository_dispatch
  if (response.status === 204 || response.ok) {
    return;
  }

  throw new Error(await formatDispatchError(response));
};
