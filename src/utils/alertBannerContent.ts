import { MeetupEvent } from '../types';
import type { AlertBannerProps } from '../components/AlertBanner';
import { formatFullDate, formatTime } from './dateFormatters';

export const buildHolidayMeetupAlertBannerProps = (
  event: MeetupEvent
): AlertBannerProps => {
  const venueName = event.venue?.name ?? 'Buffalo Wild Wings';
  const dateLine = event.local_date ? formatFullDate(event.local_date) : undefined;
  const timeLine = event.local_time ? formatTime(event.local_time) : undefined;

  const details = [dateLine, timeLine, venueName].filter(
    (line): line is string => Boolean(line)
  );

  return {
    variant: 'holiday',
    badge: 'Holiday meetup',
    title: `Holiday gathering at ${venueName}`,
    ariaLabel: 'Upcoming holiday meetup announcement',
    details,
    primaryAction: {
      label: 'Event details',
      to: `/event/${event.id}`
    },
    secondaryAction: event.link
      ? {
          label: 'RSVP on Meetup',
          href: event.link,
          external: true
        }
      : undefined
  };
};