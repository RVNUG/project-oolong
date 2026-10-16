import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSponsors } from '../../services/sponsorsService';
import { useSponsors } from '../useSponsors';

vi.mock('../../services/sponsorsService');

const initialSponsors = [{ id: 1, name: 'Initial sponsor', description: 'Initial', logo: 'initial.svg', website: 'https://initial.example' }];
const updatedSponsors = [{ id: 2, name: 'Updated sponsor', description: 'Updated', logo: 'updated.svg', website: 'https://updated.example' }];

describe('useSponsors hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(fetchSponsors).mockResolvedValue(initialSponsors);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads sponsors on mount and completes loading', async () => {
    const { result } = renderHook(() => useSponsors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sponsors).toEqual(initialSponsors);
    expect(result.current.error).toBeNull();
    expect(fetchSponsors).toHaveBeenCalledOnce();
  });

  it('exposes a fetch error and clears it after a successful refresh', async () => {
    vi.mocked(fetchSponsors).mockRejectedValueOnce(new Error('Sponsor service unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useSponsors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Sponsor service unavailable');

    await act(async () => {
      await result.current.refreshSponsors();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.sponsors).toEqual(initialSponsors);
  });

  it('replaces sponsor data when refreshed', async () => {
    const { result } = renderHook(() => useSponsors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    vi.mocked(fetchSponsors).mockResolvedValue(updatedSponsors);

    await act(async () => {
      await result.current.refreshSponsors();
    });

    expect(result.current.sponsors).toEqual(updatedSponsors);
    expect(fetchSponsors).toHaveBeenCalledTimes(2);
  });
});