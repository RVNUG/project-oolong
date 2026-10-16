import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTeamMembers } from '../useTeamMembers';
import { fetchTeamMembers } from '../../services/teamService';

vi.mock('../../services/teamService');

const CACHE_KEY = 'rvnug_team_cache';
const CACHE_EXPIRY_KEY = 'rvnug_team_cache_expiry';
const cachedMembers = [{ id: 1, name: 'Cached member', role: 'Organizer', bio: 'Cached bio', image: 'cached.jpg' }];
const fetchedMembers = [{ id: 2, name: 'Fetched member', role: 'Speaker', bio: 'Fetched bio', image: 'fetched.jpg' }];

describe('useTeamMembers hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    vi.mocked(fetchTeamMembers).mockResolvedValue(fetchedMembers);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('uses unexpired cached members without fetching', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedMembers));
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + 60_000));

    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.teamMembers).toEqual(cachedMembers);
    expect(fetchTeamMembers).not.toHaveBeenCalled();
  });

  it('fetches and replaces an expired cache', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedMembers));
    localStorage.setItem(CACHE_EXPIRY_KEY, '0');

    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchTeamMembers).toHaveBeenCalledOnce();
    expect(result.current.teamMembers).toEqual(fetchedMembers);
    expect(JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]')).toEqual(fetchedMembers);
  });

  it('fetches when the cached JSON is malformed', async () => {
    localStorage.setItem(CACHE_KEY, '{invalid json');
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + 60_000));

    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchTeamMembers).toHaveBeenCalledOnce();
    expect(result.current.teamMembers).toEqual(fetchedMembers);
  });

  it('bypasses cache when manually refreshed', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedMembers));
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + 60_000));
    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshTeamMembers();
    });

    expect(fetchTeamMembers).toHaveBeenCalledOnce();
    expect(result.current.teamMembers).toEqual(fetchedMembers);
  });

  it('keeps stale cached members available when fetching fails', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedMembers));
    localStorage.setItem(CACHE_EXPIRY_KEY, '0');
    vi.mocked(fetchTeamMembers).mockRejectedValue(new Error('Service unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Service unavailable');
    expect(result.current.teamMembers).toEqual(cachedMembers);
  });
});