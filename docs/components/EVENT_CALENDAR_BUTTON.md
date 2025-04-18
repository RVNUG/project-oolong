# EventCalendarButton Component

The `EventCalendarButton` component provides functionality to add events to various calendar services (Google, Apple, Outlook, Yahoo, etc.) directly from the RVNUG website.

## Overview

This component creates a dropdown menu with options to add events to different calendar services. It handles the generation of proper calendar links and download formats based on event data.

## Features

- **Multiple Calendar Service Support**: Integrates with Google Calendar, Apple Calendar, Outlook, Yahoo, and generic iCal downloads
- **Semantic Dropdown Menu**: Accessible dropdown with proper ARIA attributes and keyboard navigation
- **Intelligent Event Duration**: Automatically determines appropriate event duration based on event type and start time
- **Cross-browser Compatible**: Works across different browsers and devices
- **Mobile-responsive Design**: Properly displays and functions on mobile devices

## Technical Implementation

The component uses React hooks for state management and DOM manipulation:
- `useState` for tracking dropdown open/closed state
- `useRef` for referencing DOM elements
- `useEffect` for handling outside clicks to close the dropdown

## Smart Duration Calculation

A key feature of the component is its ability to intelligently determine appropriate event end times based on the event pattern:

- **Morning Events** (like "Code and Coffee" or events starting between 8-11am): 3-hour duration
- **Social Events** (events with "social", "mixer", or "networking" in the title): 2-hour duration
- **Evening Events** (events starting between 5-7pm): 1.5-hour duration
- **Default**: 2-hour duration for all other event types

This approach provides a better user experience as calendar invites will reflect the expected duration of different types of events.

## Accessibility

The component implements the following accessibility features:
- ARIA attributes (`aria-haspopup`, `aria-expanded`, etc.)
- Keyboard navigation and focus management
- Proper semantic HTML structure
- Screen reader compatibility

## Usage Example

```jsx
import { MeetupEvent } from '../types';
import EventCalendarButton from './EventCalendarButton';

const EventDetails = ({ event }: { event: MeetupEvent }) => {
  return (
    <div className="event-actions">
      <EventCalendarButton 
        event={event}
        buttonLabel="Add to Calendar"
        className="btn btn-calendar"
      />
    </div>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `event` | `MeetupEvent` | Required | The event object containing details like date, time, location, etc. |
| `buttonLabel` | `string` | "Add to Calendar" | Text to display on the button |
| `className` | `string` | "" | Additional CSS classes to apply to the component container |

## Recent Improvements

### April 2025

1. **Fixed Dropdown Positioning**:
   - Ensured the dropdown menu displays directly below the button in desktop view
   - Made the dropdown properly positioned on mobile devices
   - Prevented event card animations from interfering with the dropdown
   
2. **Improved Event Duration Calculation**:
   - Implemented intelligent duration calculation based on event type and start time
   - Calendar invites now reflect the expected duration of different types of events
   
3. **Enhanced Accessibility**:
   - Fixed ARIA attributes for better screen reader compatibility
   - Added proper focus management for keyboard navigation
   
4. **Performance Optimizations**:
   - Improved component rendering performance
   - Added better event handling for click detection

## Notes for Developers

- The component requires Font Awesome icons for proper display
- Event duration calculation can be extended in the future if needed
- When updating this component, ensure cross-browser compatibility is maintained 