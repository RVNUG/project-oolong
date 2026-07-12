import { MeetupEvent } from '../types';

const WEEKDAY =
  '(?:Mon(?:day)?|Tue(?:s(?:day)?)?|Wed(?:nesday)?|Thu(?:rs(?:day)?)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)';
const MONTH =
  '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';

/**
 * True when the Meetup title is a Code & Coffee (coworking) session, not a talk.
 */
export const isCodeAndCoffeeEvent = (event: MeetupEvent): boolean =>
  /code\s*(&|and)\s*coffee/i.test(event.name);

/**
 * Strip Meetup mode prefixes and embedded date/time from an event title.
 */
export const cleanMeetupEventName = (name: string): string => {
  let shortName = name
    .replace(/^(In[-\s]?Person|Online(?:\s+Meeting)?)\s*[-:]\s*/i, '')
    .trim();

  shortName = shortName.replace(
    new RegExp(`,\\s*${WEEKDAY},\\s*${MONTH}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s*.*)?$`, 'i'),
    ''
  );
  shortName = shortName.replace(
    new RegExp(`\\s+on\\s+${MONTH}\\s+\\d{1,2}(?:st|nd|rd|th)?(?:\\s+from\\s+.*)?$`, 'i'),
    ''
  );
  shortName = shortName
    .replace(/\s+from\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b.*$/i, '')
    .replace(/[,\s]+$/g, '')
    .trim();

  return shortName;
};

/**
 * Newest past presentation talk (in-person or online; excludes Code & Coffee).
 * Expects pastEvents sorted newest-first (as from useEvents).
 */
export const getLatestPastTalk = (
  pastEvents: MeetupEvent[]
): MeetupEvent | undefined =>
  pastEvents.find((event) => !isCodeAndCoffeeEvent(event));
