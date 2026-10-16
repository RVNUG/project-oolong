import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchEventById, fetchEvents } from '../eventsService';
import { getMeetupEvents } from '../meetupService';

vi.mock('../meetupService', () => ({
  getMeetupEvents: vi.fn(),
}));

const eventList = [{
  id: 'evt-1',
  name: 'Community meetup',
  local_date: '2026-11-01',
  local_time: '18:00',
  is_online: false,
  description: 'A community meetup',
  link: 'https://example.test/events/evt-1',
}];
const fetchMock = vi.fn();

describe('eventsService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    vi.mocked(getMeetupEvents).mockResolvedValue(eventList);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns events from the wrapped local data format', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ events: eventList }),
    });

    await expect(fetchEvents()).resolves.toEqual(eventList);
    expect(getMeetupEvents).not.toHaveBeenCalled();
  });

  it('supports a direct array of local events', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(eventList),
    });

    await expect(fetchEvents()).resolves.toEqual(eventList);
    expect(getMeetupEvents).not.toHaveBeenCalled();
  });

  it('falls back to Meetup when the local request is unsuccessful', async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await expect(fetchEvents()).resolves.toEqual(eventList);
    expect(getMeetupEvents).toHaveBeenCalledOnce();
  });

  it('falls back to Meetup when the local payload has an unexpected shape', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ unexpected: true }),
    });

    await expect(fetchEvents()).resolves.toEqual(eventList);
    expect(getMeetupEvents).toHaveBeenCalledOnce();
  });

  it('falls back to Meetup when the local request rejects', async () => {
    fetchMock.mockRejectedValue(new Error('Network unavailable'));

    await expect(fetchEvents()).resolves.toEqual(eventList);
    expect(getMeetupEvents).toHaveBeenCalledOnce();
  });

  it('finds an event by ID and returns null when it is missing', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ events: eventList }),
    });

    await expect(fetchEventById('evt-1')).resolves.toEqual(eventList[0]);
    await expect(fetchEventById('missing')).resolves.toBeNull();
  });
});