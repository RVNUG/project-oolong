import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EventCalendarButton from '../EventCalendarButton';
import type { MeetupEvent } from '../../types';

const event: MeetupEvent = {
  id: 'calendar-1',
  name: 'Code and Coffee',
  local_date: '2026-11-01',
  local_time: '10:00',
  duration: 90 * 60 * 1000,
  is_online: false,
  description: '<p>Build <strong>together</strong></p>',
  link: 'https://example.test/event',
  venue: { name: 'Mill Mountain Coffee', address_1: '123 Main St', city: 'Roanoke', state: 'VA' },
};

describe('EventCalendarButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when date or time is unavailable', () => {
    const { container } = render(<EventCalendarButton event={{ ...event, local_time: '' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('opens the calendar menu, closes on outside click, and supports custom labels', () => {
    render(<EventCalendarButton event={event} buttonLabel="Save this event" className="calendar-action" />);
    const trigger = screen.getByRole('button', { name: 'Add to Calendar' });
    expect(trigger).toHaveTextContent('Save this event');
    expect(trigger).toHaveClass('calendar-action');

    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(5);

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens Google, Outlook, and Yahoo calendar URLs with event details', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<EventCalendarButton event={event} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Calendar' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Google Calendar' }));
    expect(open).toHaveBeenLastCalledWith(expect.stringContaining('calendar.google.com/calendar/render?action=TEMPLATE'), '_blank');
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent('Code and Coffee'));
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent('Mill Mountain Coffee, 123 Main St, Roanoke, VA'));

    fireEvent.click(screen.getByRole('button', { name: 'Add to Calendar' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Outlook' }));
    expect(open).toHaveBeenLastCalledWith(expect.stringContaining('outlook.live.com/calendar/0/action/compose'), '_blank');

    fireEvent.click(screen.getByRole('button', { name: 'Add to Calendar' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Yahoo' }));
    expect(open).toHaveBeenLastCalledWith(expect.stringContaining('calendar.yahoo.com/'), '_blank');
  });

  it('downloads an iCalendar file with sanitized description and inferred event duration', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-calendar');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const appendChild = vi.spyOn(document.body, 'appendChild');

    render(<EventCalendarButton event={{ ...event, duration: undefined }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Calendar' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Download .ics' }));

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/calendar;charset=utf-8');
    expect(click).toHaveBeenCalledOnce();
    const anchor = appendChild.mock.calls.map(([node]) => node).find(node => node instanceof HTMLAnchorElement) as HTMLAnchorElement;
    expect(anchor.download).toBe('Code_and_Coffee.ics');
    expect(anchor.href).toContain('blob:test-calendar');
  });

  it('uses the online default location and closes the menu after selecting an option', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<EventCalendarButton event={{ ...event, is_online: true, venue: undefined }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Calendar' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Google Calendar' }));

    expect(open.mock.calls[0][0]).toContain(encodeURIComponent('Online Event'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});