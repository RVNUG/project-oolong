import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../config/routes', async () => {
  const React = await import('react');
  return {
    routes: [{ path: '/', element: React.createElement('h1', null, 'App route rendered') }],
  };
});

describe('App', () => {
  it('renders the routed page inside the shared application layout', async () => {
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'App route rendered' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'App route rendered' }));
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });
});