import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TeamMemberCard from '../TeamMemberCard';
import type { TeamMember } from '../../types';

vi.mock('../LazyImage', () => ({
  default: (props: { src: string; alt: string }) => <img data-testid="lazy-image" src={props.src} alt={props.alt} />,
}));
vi.mock('../../utils/imagePaths', () => ({ getImageWithFallback: vi.fn(path => path || '/images/team/generic-member.svg') }));

const member: TeamMember = {
  id: 3,
  name: 'Taylor Doe',
  role: 'Community Organizer',
  bio: 'Brings developers together.',
  image: 'https://images.example.test/taylor.jpg',
  linkedin: 'https://linkedin.example.test/taylor',
  twitter: 'https://social.example.test/taylor',
  github: 'https://github.com/taylordoe',
};

describe('TeamMemberCard', () => {
  it('renders member details, image, and all available social links', () => {
    render(<TeamMemberCard member={member} />);
    expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument();
    expect(screen.getByText(member.role)).toBeInTheDocument();
    expect(screen.getByText(member.bio)).toBeInTheDocument();
    expect(screen.getByTestId('lazy-image')).toHaveAttribute('src', member.image);
    expect(screen.getByRole('link', { name: "Taylor Doe's LinkedIn profile" })).toHaveAttribute('href', member.linkedin);
    expect(screen.getByRole('link', { name: "Taylor Doe's Twitter profile" })).toHaveAttribute('href', member.twitter);
    expect(screen.getByRole('link', { name: "Taylor Doe's GitHub profile" })).toHaveAttribute('href', member.github);
  });

  it('omits social links that are not provided', () => {
    render(<TeamMemberCard member={{ ...member, linkedin: undefined, twitter: undefined, github: undefined }} />);
    expect(screen.queryByRole('link', { name: /LinkedIn profile/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Twitter profile/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /GitHub profile/ })).not.toBeInTheDocument();
  });
});