import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import NavBar from '../NavBar';
import { ThemeProvider } from '../../context/ThemeContext';

const Location = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
};

const renderNav = () => render(
  <MemoryRouter initialEntries={['/']}>
    <ThemeProvider>
      <NavBar />
      <Location />
    </ThemeProvider>
  </MemoryRouter>
);

describe('NavBar', () => {
  it('renders primary links and toggles the mobile menu', () => {
    renderNav();
    expect(screen.getByRole('navigation', { name: 'Main Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/team');
    expect(screen.getByRole('link', { name: 'Sponsors' })).toHaveAttribute('href', '/sponsors');
    expect(screen.queryByRole('link', { name: 'Showcase' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('nav-menu')).toHaveClass('nav-menu active');
  });

  it('closes on Escape and returns focus to the menu button', () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    screen.getByRole('button', { name: 'Close menu' });
    fireEvent.keyDown(document, { key: 'Escape' });

    const openButton = screen.getByRole('button', { name: 'Open menu' });
    expect(openButton).toHaveFocus();
    expect(document.getElementById('nav-menu')).not.toHaveClass('active');
    expect(openButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on outside clicks and when the route changes', () => {
    renderNav();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.mouseDown(document.body);
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(screen.getByRole('link', { name: 'Events' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/events');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});