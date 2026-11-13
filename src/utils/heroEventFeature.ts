import { MeetupEvent } from '../types';
import { cleanMeetupEventName, isCodeAndCoffeeEvent } from './eventFilters';

export type HeroEventFeatureDisplay = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta: string;
  eventPath: string;
};

const formatUpNextEyebrow = (localDate: string): string => {
  const parts = localDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, monthIndex, day);
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      return `UP NEXT · ${month} ${day}`;
    }
  }
  return 'UP NEXT';
};

const stripLocationPrefix = (name: string): string =>
  name.replace(/^Salem[-:\s]+/i, '').trim();

/**
 * Split a Meetup title into a headline and optional quoted hook line.
 */
export const splitHeroEventTitle = (name: string): { title: string; subtitle?: string } => {
  const cleaned = stripLocationPrefix(cleanMeetupEventName(name));
  const quoteMatch = cleaned.match(/^["“](.+?)["”]\s*(.+)$/);
  if (quoteMatch) {
    const hook = quoteMatch[1].trim().replace(/\.{3}$/, '…');
    const title = quoteMatch[2].trim();
    const subtitle = hook.endsWith('…') ? `"${hook}"` : `"${hook}…"`;
    return { title, subtitle };
  }
  return { title: cleaned };
};

export const formatHeroEventMeta = (event: MeetupEvent): string => {
  if (event.is_online) {
    return 'Online · Meetup';
  }
  const city = event.venue?.city?.trim() || 'Roanoke';
  const kind = isCodeAndCoffeeEvent(event) ? 'Code & Coffee' : 'Tech talk';
  return `${city} · ${kind}`;
};

export const buildHeroEventFeature = (event: MeetupEvent): HeroEventFeatureDisplay => {
  const { title, subtitle } = splitHeroEventTitle(event.name);
  return {
    eyebrow: formatUpNextEyebrow(event.local_date),
    title,
    subtitle,
    meta: formatHeroEventMeta(event),
    eventPath: `/event/${event.id}`,
  };
};
