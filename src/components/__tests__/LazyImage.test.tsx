import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LazyImage from '../LazyImage';

let observerCallback: IntersectionObserverCallback;
let disconnect: ReturnType<typeof vi.fn>;

class MockIntersectionObserver {
  disconnect = vi.fn();
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
    disconnect = this.disconnect;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = '';
  thresholds = [];
}

describe('LazyImage', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows a placeholder until the image intersects, then marks it loaded', () => {
    render(<LazyImage src="/images/team/taylor.jpg" alt="Taylor" width={120} height="160" className="portrait" />);

    expect(screen.getAllByAltText('Taylor')).toHaveLength(1);
    expect(screen.queryByRole('img', { name: 'Taylor', hidden: true })).toBeInTheDocument();
    const container = screen.getByAltText('Taylor').parentElement;
    expect(container).toHaveClass('lazy-image-container portrait');
    expect(container?.style.getPropertyValue('--lazy-image-width')).toBe('120px');
    expect(container?.style.getPropertyValue('--lazy-image-height')).toBe('160');

    act(() => observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    const images = screen.getAllByAltText('Taylor');
    expect(images).toHaveLength(2);
    expect(images[1]).toHaveAttribute('src', '/images/team/taylor.jpg');
    fireEvent.load(images[1]);
    expect(images[0]).toHaveClass('lazy-image-placeholder--hidden');
    expect(images[1]).toHaveClass('lazy-image--loaded');
    expect(disconnect).toHaveBeenCalled();
  });

  it('loads the fallback image after the visible image fails', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const imageInstances: Array<{ onload: (() => void) | null; src: string }> = [];
    vi.stubGlobal('Image', class {
      onload: (() => void) | null = null;
      set src(value: string) {
        Object.defineProperty(this, 'src', { value, configurable: true });
        imageInstances.push(this);
      }
    });
    render(<LazyImage src="/missing.jpg" alt="Missing portrait" />);
    act(() => observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    fireEvent.error(screen.getAllByAltText('Missing portrait')[1]);

    expect(error).toHaveBeenCalledWith('Failed to load image:', expect.objectContaining({ src: '/missing.jpg' }));
    expect(screen.getAllByAltText('Missing portrait')[1]).toHaveAttribute('src', '/images/team/generic-member.svg');
    expect(imageInstances[0].src).toBe('/images/team/generic-member.svg');
    act(() => imageInstances[0].onload?.());
    expect(screen.getAllByAltText('Missing portrait')[1]).toHaveClass('lazy-image--loaded');
  });

  it('disconnects its observer on unmount and observes the placeholder image', () => {
    const { unmount } = render(<LazyImage src="/one.jpg" alt="One" width="100%" height="auto" />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});