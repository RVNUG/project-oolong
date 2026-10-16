import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchLocalEvents,
  fetchMeetupEvents,
  fetchMeetupEventsViaProxy,
  getMeetupEvents,
} from '../meetupService';
import type { MeetupEvent } from '../../types';

const meetupEvents: MeetupEvent[] = [{
  id: 'meetup-1',
  name: 'Community meetup',
  local_date: '2026-11-01',
  local_time: '18:00',
  is_online: false,
  description: 'Monthly gathering',
  link: 'https://example.test/events/meetup-1',
}];
const fetchMock = vi.fn();

const getJsonpScript = () => document.getElementById('meetup-jsonp') as HTMLScriptElement;
const getJsonpCallback = () => {
  const callbackName = new URL(getJsonpScript().src).searchParams.get('callback');
  if (!callbackName) throw new Error('JSONP callback name was not set');
  const callback = (window as unknown as Record<string, (data: { results?: MeetupEvent[] }) => void>)[callbackName];
  if (!callback) throw new Error('JSONP callback was not registered');
  return callback;
};

describe('meetupService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.getElementById('meetup-jsonp')?.remove();
    vi.restoreAllMocks();
  });

  it('loads events from the local data resource', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue({ events: meetupEvents }) });

    await expect(fetchLocalEvents()).resolves.toEqual(meetupEvents);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('data/events.json'));
  });

  it('returns an empty local list for unsuccessful responses or invalid fetches', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchLocalEvents()).resolves.toEqual([]);

    fetchMock.mockRejectedValueOnce(new Error('Network unavailable'));
    await expect(fetchLocalEvents()).resolves.toEqual([]);
  });

  it('resolves JSONP results and removes its callback and script', async () => {
    const eventsPromise = fetchMeetupEvents();
    const callbackName = new URL(getJsonpScript().src).searchParams.get('callback');
    if (!callbackName) throw new Error('JSONP callback name was not set');

    getJsonpCallback()({ results: meetupEvents });

    await expect(eventsPromise).resolves.toEqual(meetupEvents);
    expect(document.getElementById('meetup-jsonp')).toBeNull();
    expect((window as unknown as Record<string, unknown>)[callbackName]).toBeUndefined();
  });

  it('rejects JSONP requests when the script fails or times out', async () => {
    const errorPromise = fetchMeetupEvents();
    const errorAssertion = expect(errorPromise).rejects.toThrow('Failed to load Meetup events');
    getJsonpScript().onerror?.(new Event('error'));
    await errorAssertion;

    vi.useFakeTimers();
    const timeoutPromise = fetchMeetupEvents();
    const timeoutAssertion = expect(timeoutPromise).rejects.toThrow('Timed out waiting for Meetup API response');
    await vi.advanceTimersByTimeAsync(10_000);
    await timeoutAssertion;
  });

  it('fetches events through the proxy and surfaces proxy failures', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue(meetupEvents) });
    await expect(fetchMeetupEventsViaProxy()).resolves.toEqual(meetupEvents);
    expect(fetchMock.mock.calls[0][0]).toContain(encodeURIComponent('/events?status=upcoming,past'));

    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock.mockResolvedValueOnce({ ok: false, status: 502 });
    await expect(fetchMeetupEventsViaProxy()).rejects.toThrow('Failed to fetch from proxy: 502');
  });

  it('prefers local events and falls back to JSONP when local data is empty', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ events: [] }) });
    vi.spyOn(document.head, 'appendChild').mockImplementation(node => {
      const script = node as HTMLScriptElement;
      const callbackName = new URL(script.src).searchParams.get('callback');
      if (!callbackName) throw new Error('JSONP callback name was not set');
      const callback = (window as unknown as Record<string, (data: { results: MeetupEvent[] }) => void>)[callbackName];
      queueMicrotask(() => callback({ results: meetupEvents }));
      return script;
    });

    await expect(getMeetupEvents()).resolves.toEqual(meetupEvents);
  });

  it('returns an empty list when local and remote fallbacks fail', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ events: [] }) });
    vi.spyOn(document.head, 'appendChild').mockImplementation(node => {
      const script = node as HTMLScriptElement;
      queueMicrotask(() => script.onerror?.(new Event('error')));
      return script;
    });
    fetchMock.mockResolvedValueOnce({ ok: false, status: 502 });

    await expect(getMeetupEvents()).resolves.toEqual([]);
  });
});