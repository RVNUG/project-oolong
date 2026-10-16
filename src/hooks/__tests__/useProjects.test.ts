import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useProjects from '../useProjects';

describe('useProjects', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns sample projects after its loading delay', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.projects).toHaveLength(6);
    expect(result.current.projects[0]).toMatchObject({ title: 'Blazor Component Library', category: 'library' });
    expect(result.current.projects.every(project => project.approved)).toBe(true);
  });
});