import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import NotFoundPage from '../NotFoundPage';

vi.mock('../../components/SEO', () => ({
  default: (props: { title: string; pathName: string; robots: string }) => (
    <output data-testid="seo-props">{`${props.title}|${props.pathName}|${props.robots}`}</output>
  ),
}));

describe('NotFoundPage', () => {
  it('describes the missing route and offers a link home', () => {
    render(<MemoryRouter initialEntries={['/missing-page']}><NotFoundPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: '404 - Page Not Found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to Home' })).toHaveAttribute('href', '/');
    expect(screen.getByTestId('seo-props')).toHaveTextContent('Page Not Found');
    expect(screen.getByTestId('seo-props')).toHaveTextContent('/missing-page');
    expect(screen.getByTestId('seo-props')).toHaveTextContent('noindex, nofollow');
  });
});