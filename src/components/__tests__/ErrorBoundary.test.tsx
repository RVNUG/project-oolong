import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';

const BrokenChild = () => {
  throw new Error('render failure');
};

describe('ErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders children normally when there is no error', () => {
    render(<ErrorBoundary><p>Healthy content</p></ErrorBoundary>);
    expect(screen.getByText('Healthy content')).toBeInTheDocument();
  });

  it('shows the default fallback and logs render errors', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(<ErrorBoundary><BrokenChild /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(error).toHaveBeenCalledWith('Uncaught error:', expect.any(Error), expect.any(Object));
  });

  it('uses a supplied fallback for a rendering error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(<ErrorBoundary fallback={<div>Custom recovery</div>}><BrokenChild /></ErrorBoundary>);
    expect(screen.getByText('Custom recovery')).toBeInTheDocument();
  });
});