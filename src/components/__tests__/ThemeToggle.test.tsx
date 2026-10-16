import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ThemeToggle', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
    vi.restoreAllMocks();
  });

  it('toggles the saved theme and updates its accessible label and icon', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    const toggle = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(toggle.querySelector('.fa-moon')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
    expect(toggle.querySelector('.fa-sun')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark-theme');
    expect(localStorage.getItem('rvnug-theme')).toBe('dark');
  });

  it('uses and persists a saved preference instead of the system setting', () => {
    localStorage.setItem('rvnug-theme', 'dark');
    const matchMedia = vi.spyOn(window, 'matchMedia');
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(document.documentElement).toHaveClass('dark-theme');
  });

  it('throws when the theme hook is used outside its provider', async () => {
    const { useTheme } = await import('../../context/ThemeContext');
    const Consumer = () => {
      useTheme();
      return null;
    };
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Consumer />)).toThrow('useTheme must be used within a ThemeProvider');
    error.mockRestore();
  });
});