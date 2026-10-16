import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import Layout from '../Layout';

vi.mock('../NavBar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../Footer', () => ({ default: () => <footer data-testid="footer" /> }));
vi.mock('../JsonLd', () => ({ default: ({ data }: { data: Record<string, unknown> }) => <output data-testid="jsonld">{String(data['@type'])}</output> }));

describe('Layout', () => {
  it('renders navigation, structured data, skip link, page content, and footer', () => {
    render(<MemoryRouter><Layout><h1>Page content</h1></Layout></MemoryRouter>);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getAllByTestId('jsonld').map(node => node.textContent)).toEqual(['Organization', 'WebSite']);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'Page content' }));
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});