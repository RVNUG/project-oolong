import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProjectCard from '../ProjectCard';
import type { Project } from '../../types';

const project: Project = {
  id: 'project-1',
  title: 'Sample App',
  description: 'A sample project for the community.',
  author: 'Taylor',
  githubUrl: 'https://github.com/example/sample',
  liveUrl: 'https://sample.example.test',
  imageUrl: '/images/projects/sample.png',
  category: 'application',
  tags: ['React', 'TypeScript'],
  dateAdded: '2026-01-01',
  approved: true,
};

describe('ProjectCard', () => {
  it('renders project details, tags, and available links', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('heading', { name: 'Sample App' })).toBeInTheDocument();
    expect(screen.getByText('By Taylor')).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Sample App GitHub repository' })).toHaveAttribute('href', project.githubUrl);
    expect(screen.getByRole('link', { name: 'View Sample App live site' })).toHaveAttribute('href', project.liveUrl);
  });

  it('omits optional links and displays a title fallback after image failure', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<ProjectCard project={{ ...project, githubUrl: undefined, liveUrl: undefined }} />);
    expect(screen.queryByRole('link', { name: /GitHub repository/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /live site/ })).not.toBeInTheDocument();

    fireEvent.error(screen.getByAltText('Screenshot of Sample App'));
    expect(warn).toHaveBeenCalledWith(`Failed to load project image: ${project.imageUrl}`);
    expect(screen.getByText('Sample App', { selector: '.project-image-fallback span' })).toBeInTheDocument();
  });
});