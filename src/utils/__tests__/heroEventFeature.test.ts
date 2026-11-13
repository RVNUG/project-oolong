import { describe, expect, it } from 'vitest';
import { MeetupEvent } from '../../types';
import {
  buildHeroEventFeature,
  formatHeroEventMeta,
  splitHeroEventTitle
} from '../heroEventFeature';

const baseEvent: MeetupEvent = {
  id: 'e-1',
  name: 'In Person-Salem-"So our solo developer died..." Software archaeology with AI',
  local_date: '2026-11-05',
  local_time: '18:00',
  description: '',
  link: 'https://example.com',
  is_online: false,
  venue: { name: 'Medeco', city: 'Salem' }
};

describe('heroEventFeature', () => {
  it('splits quoted hook from talk title', () => {
    expect(splitHeroEventTitle(baseEvent.name)).toEqual({
      title: 'Software archaeology with AI',
      subtitle: '"So our solo developer died…"'
    });
  });

  it('builds UP NEXT eyebrow and meta line', () => {
    const feature = buildHeroEventFeature(baseEvent);
    expect(feature.eyebrow).toBe('UP NEXT · NOV 5');
    expect(feature.meta).toBe('Salem · Tech talk');
    expect(feature.eventPath).toBe('/event/e-1');
  });

  it('labels Code & Coffee events', () => {
    const coffee: MeetupEvent = {
      ...baseEvent,
      name: 'In Person: Code & Coffee on May 16th from 10am-1pm ET',
      venue: { name: 'Mill Mountain Coffee', city: 'Roanoke' }
    };
    expect(formatHeroEventMeta(coffee)).toBe('Roanoke · Code & Coffee');
  });
});
