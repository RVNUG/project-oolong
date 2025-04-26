# Add to Calendar Button Feature

## Overview
The Add to Calendar button feature allows users to download event information to their preferred calendar app. This feature supports multiple calendar types:

- Apple Calendar (iCal)
- Google Calendar
- Microsoft 365/Outlook
- Yahoo Calendar
- Generic iCal downloads (for other calendar applications)

## Implementation Details

### Custom Implementation
We've created a custom implementation for the calendar button instead of using an external library. This gives us full control over the styling, behavior, and functionality while avoiding external dependencies.

### Key Features
- Support for all major calendar platforms
- Responsive dropdown design that works well on mobile and desktop
- Consistent styling that matches our design system
- Eastern timezone handling for all calendar options
- Support for both online and in-person events
- Fixed positioning to ensure dropdown is always visible

## Implementation Summary

### Components Created
1. **EventCalendarButton** (`src/components/EventCalendarButton.tsx`)
   - Custom React component that handles all calendar integrations
   - Takes a MeetupEvent object and generates calendar details
   - Creates a dropdown with options for different calendar services
   - Handles download of .ics files and opening of calendar URLs
   - Uses fixed positioning to ensure the dropdown is always accessible

2. **CSS Styling** (`src/assets/css/event-calendar-button.css`) 
   - Custom styles to match our application's design system
   - Dark mode support
   - Mobile-specific styling
   - Fixed positioning with proper z-index to avoid container clipping

### Integration Points
1. **Event Detail Page** (`src/pages/EventDetailPage.tsx`)
   - Replaced the non-functional "Add to Calendar" button with the new component
   - Full-featured implementation with all calendar options

2. **Event Card** (`src/components/EventCard.tsx`)
   - Added to event cards for quick access
   - Styled to match the existing UI

### Implementation Details
- **Google Calendar**: Opens a new window to Google Calendar with event details pre-filled
- **Apple Calendar**: Downloads a .ics file formatted for Apple Calendar
- **Outlook**: Opens a new window to Outlook.com with event details pre-filled
- **Yahoo Calendar**: Opens a new window to Yahoo Calendar with event details pre-filled
- **.ics Download**: Provides a direct download of a .ics file compatible with most calendar applications

### Dropdown Positioning
- Dropdown menu is positioned using fixed positioning with high z-index
- Position is calculated based on button position in the viewport
- Screen boundaries are checked to prevent dropdowns from going off-screen
- Recalculated on scroll and window resize events
- Animation provides visual feedback when opening

### Timezone Handling
- All calendar links and .ics files are set to Eastern Time Zone (America/New_York)
- Added explicit timezone information to .ics files
- Added timezone parameter to Google Calendar links

## User Experience
- When a user clicks the "Add to Calendar" button, a dropdown appears with options for different calendar platforms
- Selecting a platform will either:
  - Open the selected calendar website with pre-filled event details (Google, Outlook, Yahoo)
  - Download an iCal (.ics) file for use with Apple Calendar or other applications
- The dropdown auto-positions based on screen size and available space
- Clicking outside the dropdown automatically closes it

## Testing Guide
To test this implementation:

1. Navigate to the Events page and view event listings
2. For upcoming events, click "Add to Calendar" on an event card
3. Try different calendar options and verify they open/download correctly
4. Navigate to an individual event detail page
5. Test the "Add to Calendar" button on the detail page
6. Verify the implementation works on:
   - Desktop browsers (Chrome, Firefox, Safari, Edge)
   - Mobile devices (iOS and Android)
   - In both light and dark modes

## Known Limitations
- The library has a small footprint but does add approximately 5KB to the bundle size
- In some WebView environments, downloading .ics files may be blocked, but the library handles this gracefully with appropriate user guidance 