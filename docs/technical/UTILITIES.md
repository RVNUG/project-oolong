# Utility Functions

This documentation covers the utility functions used throughout the application.

## Table of Contents

- [Date Formatters](#date-formatters)
- [Venue Utilities](#venue-utilities)
- [SEO Utilities](#seo-utilities)
- [Structured Data](#structured-data)

## Date Formatters

Located in `src/utils/dateFormatters.ts`, these functions handle date and time formatting consistently throughout the application.

### Key Functions

- `formatFullDate(dateString)`: Formats a date to a full date string (e.g., "Monday, January 1, 2023")
- `formatTime(timeString)`: Formats a time string (e.g., "7:00 PM")
- `formatMeetupDateTime(date_str, time_str)`: Converts Meetup date and time strings to a Date object
- `formatShortDate(date)`: Formats a date for display in event cards (e.g., "Jan 1, 2023")
- `getMonthAbbr(date)`: Gets month abbreviation (e.g., "Jan", "Feb")

## Venue Utilities

Located in `src/utils/venueUtils.ts`, these utilities handle venue address formatting and event type detection.

### Key Functions

#### `formatVenueAddress(venue, isOnline)`

Formats venue addresses properly while avoiding duplication between address_1 and city/state.

**Parameters:**
- `venue`: The venue object from a MeetupEvent
- `isOnline`: Boolean indicating if the event is online

**Returns:**
A formatted address string.

**Features:**
- Returns an empty string for online events or undefined venues
- Avoids duplication when address_1 is the same as city/state
- Handles empty or missing address fields gracefully
- Avoids unnecessary commas when fields are missing

**Example:**
```typescript
// With complete address
const venue = {
  name: 'Mill Mountain Coffee',
  address_1: '123 Main St',
  city: 'Roanoke',
  state: 'VA',
  country: 'us',
  zip: '24016'
};
formatVenueAddress(venue, false); // '123 Main St, Roanoke, VA 24016'

// When address_1 duplicates city/state
const venue2 = {
  name: 'Mill Mountain Coffee',
  address_1: 'Roanoke, VA',
  city: 'Roanoke',
  state: 'VA',
  country: 'us',
  zip: '24016'
};
formatVenueAddress(venue2, false); // 'Roanoke, VA 24016'

// With empty address_1
const venue3 = {
  name: 'Mill Mountain Coffee',
  address_1: '',
  city: 'Roanoke',
  state: 'VA',
  country: 'us',
  zip: '24016'
};
formatVenueAddress(venue3, false); // 'Roanoke, VA 24016'
```

#### `isEventOnline(event)`

Determines if an event is online based on its properties.

**Parameters:**
- `event`: The MeetupEvent object

**Returns:**
Boolean indicating if the event is online.

**Logic:**
- Returns `true` if `event.is_online` is true
- Returns `true` if the venue name is "Online Event"
- Returns `false` otherwise

**Example:**
```typescript
const onlineEvent = {
  id: 'e-1',
  name: 'Online Meeting',
  is_online: true,
  venue: {
    name: 'Some Place',
    address_1: '123 Main St'
    // ...other venue properties
  }
};
isEventOnline(onlineEvent); // true
```

## SEO Utilities

Located in `src/utils/seo.ts`, these functions help with search engine optimization.

### Key Functions

- `getCanonicalUrl()`: Returns the canonical URL for the current page
- `generateMetaTags()`: Generates meta tags for SEO

## Structured Data

Located in `src/utils/structuredData.ts`, these functions generate JSON-LD structured data for better search engine understanding.

### Key Functions

- `createEventStructuredData(event)`: Creates structured data for events
- `createBreadcrumbStructuredData(breadcrumbs)`: Creates breadcrumb structured data

## Testing

All utility functions have corresponding tests in the `src/utils/__tests__/` directory. These tests validate the functionality and handle edge cases.

For the venue utilities specifically, see `src/utils/__tests__/venueUtils.test.ts` which tests various scenarios for address formatting and online event detection. 