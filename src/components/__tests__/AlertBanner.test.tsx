import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import AlertBanner from '../AlertBanner';

const renderWithRouter = (ui: ReactElement) =>
  render(ui, { wrapper: BrowserRouter });

describe('AlertBanner', () => {
  it('renders region, variant class, and actions', () => {
    renderWithRouter(
      <AlertBanner
        variant="holiday"
        badge="Holiday meetup"
        title="Holiday gathering"
        details={['Wednesday, December 3, 2026', '6:00 PM']}
        ariaLabel="Upcoming holiday meetup announcement"
        primaryAction={{ label: 'Event details', to: '/event/e-1' }}
        secondaryAction={{
          label: 'RSVP on Meetup',
          href: 'https://www.meetup.com/example',
          external: true
        }}
      />
    );

    expect(screen.getByRole('region', { name: 'Upcoming holiday meetup announcement' })).toHaveClass(
      'alert-banner--holiday'
    );
    expect(screen.getByText('Holiday meetup')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Holiday gathering' })).toBeInTheDocument();
    expect(screen.getByText('Wednesday, December 3, 2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Event details' })).toHaveAttribute('href', '/event/e-1');

    const meetupLink = screen.getByRole('link', { name: 'RSVP on Meetup' });
    expect(meetupLink).toHaveAttribute('href', 'https://www.meetup.com/example');
    expect(meetupLink).toHaveAttribute('target', '_blank');
  });
});