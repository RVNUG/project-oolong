import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import ContactQuickQuestionBtn from '../ContactQuickQuestionBtn';

describe('ContactQuickQuestionBtn', () => {
  it('links to contact and exposes its tooltip to assistive technology', () => {
    render(<MemoryRouter><ContactQuickQuestionBtn /></MemoryRouter>);

    const link = screen.getByRole('link', { name: 'Contact us – share an idea or send feedback' });
    expect(link).toHaveAttribute('href', '/contact');
    expect(link).toHaveAttribute('aria-describedby', 'contact-qq-btn-tooltip');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Have an idea? Contact us!');
  });
});