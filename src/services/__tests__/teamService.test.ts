import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTeamMemberById, fetchTeamMembers } from '../teamService';

const teamMembers = [
  { id: 7, name: 'Taylor', role: 'Organizer', bio: 'Community volunteer', image: 'taylor.jpg' },
];
const fetchMock = vi.fn();

describe('teamService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('loads an array of team members', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(teamMembers) });

    await expect(fetchTeamMembers()).resolves.toEqual(teamMembers);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('data/team.json'));
  });

  it('rejects unsuccessful responses and invalid payloads', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Unavailable' });
    await expect(fetchTeamMembers()).rejects.toThrow('Failed to fetch team members: 503 Unavailable');

    fetchMock.mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ members: teamMembers }) });
    await expect(fetchTeamMembers()).rejects.toThrow('Invalid team members data: expected an array');

    fetchMock.mockRejectedValueOnce(new Error('Network unavailable'));
    await expect(fetchTeamMembers()).rejects.toThrow('Network unavailable');
  });

  it('looks up a member using string or numeric IDs and returns null when missing', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(teamMembers) });

    await expect(fetchTeamMemberById('7')).resolves.toEqual(teamMembers[0]);
    await expect(fetchTeamMemberById(99)).resolves.toBeNull();
  });
});