import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSponsors } from '../sponsorsService';

const sponsors = [{ id: 1, name: 'Example Sponsor', description: 'Supporter', logo: 'logo.svg', website: 'https://example.test' }];
const fetchMock = vi.fn();

describe('sponsorsService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns sponsor data from the public JSON resource', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(sponsors) });

    await expect(fetchSponsors()).resolves.toEqual(sponsors);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('data/sponsors.json'));
  });

  it('returns an empty list when the response is unsuccessful or fetch rejects', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock.mockResolvedValueOnce({ ok: false });
    await expect(fetchSponsors()).resolves.toEqual([]);

    fetchMock.mockRejectedValueOnce(new Error('Network unavailable'));
    await expect(fetchSponsors()).resolves.toEqual([]);
  });
});