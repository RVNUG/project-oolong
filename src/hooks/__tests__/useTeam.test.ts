import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTeamMembers } from '../../services/teamService';
import { useTeam } from '../useTeam';

vi.mock('../../services/teamService');

const initialMembers = [{ id: 1, name: 'Initial member', role: 'Organizer', bio: 'Initial bio', image: 'initial.jpg' }];
const updatedMembers = [{ id: 2, name: 'Updated member', role: 'Speaker', bio: 'Updated bio', image: 'updated.jpg' }];

describe('useTeam hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(fetchTeamMembers).mockResolvedValue(initialMembers);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads team members on mount and completes loading', async () => {
    const { result } = renderHook(() => useTeam());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.teamMembers).toEqual(initialMembers);
    expect(result.current.error).toBeNull();
    expect(fetchTeamMembers).toHaveBeenCalledOnce();
  });

  it('exposes a fetch error and clears it after a successful refresh', async () => {
    vi.mocked(fetchTeamMembers).mockRejectedValueOnce(new Error('Team service unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useTeam());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Team service unavailable');

    await act(async () => {
      await result.current.refreshTeam();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.teamMembers).toEqual(initialMembers);
  });

  it('replaces team data when refreshed', async () => {
    const { result } = renderHook(() => useTeam());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    vi.mocked(fetchTeamMembers).mockResolvedValue(updatedMembers);

    await act(async () => {
      await result.current.refreshTeam();
    });

    expect(result.current.teamMembers).toEqual(updatedMembers);
    expect(fetchTeamMembers).toHaveBeenCalledTimes(2);
  });
});