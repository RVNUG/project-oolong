import { getCanonicalUrl, getImageUrl } from './seo';
import { MeetupEvent } from '../types';

/**
 * Creates organization structured data for RVNUG
 * @returns Organization structured data object
 */
export const createOrganizationStructuredData = () => {
  const baseUrl = getCanonicalUrl();
  const logoUrl = getImageUrl('/images/roanoke-star-128-logo.png');

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Roanoke Valley .NET User Group',
    alternateName: 'RVNUG',
    url: baseUrl,
    logo: logoUrl,
    sameAs: [
      'https://www.meetup.com/roanoke-valley-net-user-group/',
      'https://github.com/rvnug',
      'https://www.youtube.com/channel/UCJadqJ0C2Ht4BQZdIGZlxfw'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${baseUrl}/contact`
    }
  };
};

/**
 * Creates website structured data
 * @returns WebSite structured data object
 */
export const createWebsiteStructuredData = () => {
  const baseUrl = getCanonicalUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Roanoke Valley .NET User Group',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${baseUrl}/events?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * Creates breadcrumb structured data
 * @param items - Array of breadcrumb items with name and url
 * @returns BreadcrumbList structured data object
 */
export const createBreadcrumbStructuredData = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Creates event structured data
 * @param event - The event object
 * @returns Event structured data object
 */
export const createEventStructuredData = (event: MeetupEvent) => {
  const baseUrl = getCanonicalUrl();
  const eventUrl = `${baseUrl}/event/${event.id}`;
  const organizationUrl = baseUrl;
  
  // Format start and end dates
  const startDate = event.local_date && event.local_time 
    ? `${event.local_date}T${event.local_time}` 
    : undefined;
  
  // Determine end time (assuming 2 hours if not provided)
  let endDate: string | undefined = undefined;
  if (startDate) {
    const endDateTime = new Date(startDate);
    endDateTime.setHours(endDateTime.getHours() + 2);
    endDate = endDateTime.toISOString();
  }

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description ? 
      event.description.replace(/<[^>]*>?/gm, '') : 
      'A Roanoke Valley .NET User Group event',
    url: eventUrl,
    startDate: startDate,
    endDate: endDate,
    organizer: {
      '@type': 'Organization',
      name: 'Roanoke Valley .NET User Group',
      url: organizationUrl
    }
  };

  // Add location data if available
  if (event.venue) {
    if (event.is_online || event.venue.name === 'Online Event') {
      structuredData.eventAttendanceMode = 'OnlineEventAttendanceMode';
      structuredData.location = {
        '@type': 'VirtualLocation',
        url: event.link
      };
    } else {
      structuredData.eventAttendanceMode = 'OfflineEventAttendanceMode';
      structuredData.location = {
        '@type': 'Place',
        name: event.venue.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.venue.address_1,
          addressLocality: event.venue.city,
          addressRegion: event.venue.state,
          postalCode: event.venue.zip,
          addressCountry: 'US'
        }
      };
    }
  }

  // Add image if available
  if (event.featured_photo && event.featured_photo.photo_link) {
    structuredData.image = event.featured_photo.photo_link;
  }

  // Add offers
  structuredData.offers = {
    '@type': 'Offer',
    url: event.link || eventUrl,
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  };

  return structuredData;
};

/**
 * Creates a list of events structured data
 * @param events - Array of event objects
 * @returns ItemList structured data object containing events
 */
export const createEventListStructuredData = (events: MeetupEvent[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: events.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: createEventStructuredData(event)
    }))
  };
}; 