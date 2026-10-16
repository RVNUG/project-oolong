import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CommunityShowcasePage from '../CommunityShowcasePage';
import useProjects from '../../hooks/useProjects';
import type { Project } from '../../types';

vi.mock('../../hooks/useProjects');
vi.mock('../../components/SEO', () => ({ default: () => null }));
vi.mock('../../components/JsonLd', () => ({ default: () => null }));
vi.mock('../../components/ProjectCard', () => ({
  default: ({ project }: { project: Project }) => <article data-testid="project-card">{project.title}</article>,
}));

const projects: Project[] = [
  {
    id: '1', title: 'Blazor Components', description: 'A reusable UI library', author: 'Taylor',
    imageUrl: '/blazor.png', category: 'library', tags: ['Blazor'], dateAdded: '2026-01-01', approved: true,
  },
  {
    id: '2', title: 'Weather API', description: 'A .NET service for forecasts', author: 'Jordan',
    imageUrl: '/weather.png', category: 'application', tags: ['.NET'], dateAdded: '2026-01-02', approved: true,
  },
];

const renderPage = () => render(<MemoryRouter initialEntries={['/showcase']}><CommunityShowcasePage /></MemoryRouter>);

describe('CommunityShowcasePage', () => {
  beforeEach(() => {
    vi.mocked(useProjects).mockReturnValue({ loading: false, error: null, projects });
  });

  it('shows loading and error states', () => {
    vi.mocked(useProjects).mockReturnValue({ loading: true, error: null, projects: [] });
    const { rerender } = renderPage();
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();

    vi.mocked(useProjects).mockReturnValue({ loading: false, error: 'Projects unavailable', projects: [] });
    rerender(<MemoryRouter initialEntries={['/showcase']}><CommunityShowcasePage /></MemoryRouter>);
    expect(screen.getByText('Projects unavailable')).toBeInTheDocument();
  });

  it('renders projects and category options from the available data', () => {
    renderPage();
    expect(screen.getAllByTestId('project-card')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Application' })).toBeInTheDocument();
  });

  it('filters by category and by title, description, or author', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Filter by category:'), { target: { value: 'library' } });
    expect(screen.getAllByTestId('project-card')).toHaveLength(1);
    expect(screen.getByText('Blazor Components')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter by category:'), { target: { value: 'all' } });
    fireEvent.change(screen.getByLabelText('Search projects:'), { target: { value: 'forecast' } });
    expect(screen.getAllByTestId('project-card')).toHaveLength(1);
    expect(screen.getByText('Weather API')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search projects:'), { target: { value: 'taylor' } });
    expect(screen.getByText('Blazor Components')).toBeInTheDocument();
  });

  it('shows the empty-result message when filters match no projects', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Search projects:'), { target: { value: 'no matching project' } });
    expect(screen.getByText('No projects found matching your criteria.')).toBeInTheDocument();
  });
});