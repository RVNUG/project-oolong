import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EventsPage from '../EventsPage';
import SponsorsPage from '../SponsorsPage';
import TeamPage from '../TeamPage';
import useEvents from '../../hooks/useEvents';
import useSponsors from '../../hooks/useSponsors';
import useTeam from '../../hooks/useTeam';

vi.mock('../../hooks/useEvents');
vi.mock('../../hooks/useSponsors');
vi.mock('../../hooks/useTeam');
vi.mock('../../components/SEO', () => ({ default: () => null }));
vi.mock('../../components/JsonLd', () => ({ default: () => null }));
vi.mock('../../components/EventCard', () => ({
  default: ({ event, isHero, isCompact }: { event: { name: string }; isHero?: boolean; isCompact?: boolean }) => (
    <div data-testid="event-card" data-hero={isHero} data-compact={isCompact}>{event.name}</div>
  ),
}));
vi.mock('../../components/TeamMemberCard', () => ({
  default: ({ member }: { member: { name: string } }) => <div data-testid="team-card">{member.name}</div>,
}));
vi.mock('../../components/SponsorCard', () => ({
  default: ({ sponsor }: { sponsor: { name: string } }) => <div data-testid="sponsor-card">{sponsor.name}</div>,
}));

const event = (id: string, name: string) => ({
  id,
  name,
  local_date: '2026-11-01',
  local_time: '18:00',
  is_online: false,
  description: `${name} description`,
  link: `https://example.test/events/${id}`,
  venue: { name: 'Community Hall', city: 'Roanoke' },
});

const teamMember = { id: 1, name: 'Taylor', role: 'Organizer', bio: 'Volunteer', image: 'taylor.jpg' };
const sponsor = { id: 1, name: 'Example Sponsor', description: 'Community supporter', logo: 'logo.svg', website: 'https://example.test' };

const renderPage = (page: React.ReactNode) => render(<MemoryRouter>{page}</MemoryRouter>);

describe('directory pages', () => {
  beforeEach(() => {
    vi.mocked(useEvents).mockReturnValue({
      events: [], upcomingEvents: [], pastEvents: [], loading: false, error: null,
      refreshEvents: vi.fn().mockResolvedValue(undefined),
    });
    vi.mocked(useSponsors).mockReturnValue({
      sponsors: [], loading: false, error: null,
      refreshSponsors: vi.fn().mockResolvedValue(undefined),
    });
    vi.mocked(useTeam).mockReturnValue({
      teamMembers: [], loading: false, error: null,
      refreshTeam: vi.fn().mockResolvedValue(undefined),
    });
  });

  describe('EventsPage', () => {
    it('shows loading and error states', () => {
      vi.mocked(useEvents).mockReturnValue({
        events: [], upcomingEvents: [], pastEvents: [], loading: true, error: null,
        refreshEvents: vi.fn().mockResolvedValue(undefined),
      });
      renderPage(<EventsPage />);
      expect(screen.getByText('Loading events...')).toBeInTheDocument();

      vi.mocked(useEvents).mockReturnValue({
        events: [], upcomingEvents: [], pastEvents: [], loading: false, error: 'Events unavailable',
        refreshEvents: vi.fn().mockResolvedValue(undefined),
      });
      renderPage(<EventsPage />);
      expect(screen.getByText('Events unavailable')).toBeInTheDocument();
    });

    it('shows empty states for both tabs', () => {
      renderPage(<EventsPage />);
      expect(screen.getByText('No upcoming events scheduled')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Past Events/ }));
      expect(screen.getByText('No past events found')).toBeInTheDocument();
    });

    it('renders the next event, additional events, and past event list', () => {
      const upcomingEvents = [event('next', 'Next meetup'), event('later', 'Later meetup')];
      const pastEvents = [event('past', 'Past meetup')];
      vi.mocked(useEvents).mockReturnValue({
        events: [...upcomingEvents, ...pastEvents], upcomingEvents, pastEvents, loading: false, error: null,
        refreshEvents: vi.fn().mockResolvedValue(undefined),
      });

      renderPage(<EventsPage />);
      expect(screen.getByText('Next Event')).toBeInTheDocument();
      expect(screen.getByText('Additional Upcoming Events')).toBeInTheDocument();
      expect(screen.getByText('Next meetup')).toHaveAttribute('data-hero', 'true');
      expect(screen.getByText('Later meetup')).toHaveAttribute('data-compact', 'true');

      fireEvent.click(screen.getByRole('button', { name: /Past Events/ }));
      expect(screen.getByText('Past meetup')).toBeInTheDocument();
    });
  });

  describe('TeamPage', () => {
    it('shows loading, error, empty, and populated states', () => {
      vi.mocked(useTeam).mockReturnValue({ teamMembers: [], loading: true, error: null, refreshTeam: vi.fn() });
      renderPage(<TeamPage />);
      expect(screen.getByText('Loading team members...')).toBeInTheDocument();

      vi.mocked(useTeam).mockReturnValue({ teamMembers: [], loading: false, error: 'Team unavailable', refreshTeam: vi.fn() });
      renderPage(<TeamPage />);
      expect(screen.getByText('Team unavailable')).toBeInTheDocument();

      vi.mocked(useTeam).mockReturnValue({ teamMembers: [], loading: false, error: null, refreshTeam: vi.fn() });
      renderPage(<TeamPage />);
      expect(screen.getByText('No team members found')).toBeInTheDocument();

      vi.mocked(useTeam).mockReturnValue({ teamMembers: [teamMember], loading: false, error: null, refreshTeam: vi.fn() });
      renderPage(<TeamPage />);
      expect(screen.getByTestId('team-card')).toHaveTextContent('Taylor');
    });
  });

  describe('SponsorsPage', () => {
    it('shows loading, error, empty, and populated states', () => {
      vi.mocked(useSponsors).mockReturnValue({ sponsors: [], loading: true, error: null, refreshSponsors: vi.fn() });
      renderPage(<SponsorsPage />);
      expect(screen.getByText('Loading sponsors...')).toBeInTheDocument();

      vi.mocked(useSponsors).mockReturnValue({ sponsors: [], loading: false, error: 'Sponsors unavailable', refreshSponsors: vi.fn() });
      renderPage(<SponsorsPage />);
      expect(screen.getByText('Sponsors unavailable')).toBeInTheDocument();

      vi.mocked(useSponsors).mockReturnValue({ sponsors: [], loading: false, error: null, refreshSponsors: vi.fn() });
      renderPage(<SponsorsPage />);
      expect(screen.getByText('No sponsors found')).toBeInTheDocument();

      vi.mocked(useSponsors).mockReturnValue({ sponsors: [sponsor], loading: false, error: null, refreshSponsors: vi.fn() });
      renderPage(<SponsorsPage />);
      expect(screen.getByTestId('sponsor-card')).toHaveTextContent('Example Sponsor');
    });
  });
});