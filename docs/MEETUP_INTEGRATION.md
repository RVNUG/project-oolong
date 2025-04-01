# RVNUG Website - Meetup API Integration Guide

This document provides detailed information about the Meetup API integration for the RVNUG website.

## Overview

The RVNUG website dynamically fetches events from the [RVNUG Meetup page](https://www.meetup.com/roanoke-valley-net-user-group/) to display upcoming and past events. This ensures that event information is always up-to-date and reduces the need to maintain event data in multiple places.

## How It Works

1. The website makes an API request to the Meetup API to fetch event data
2. Events are sorted into upcoming and past events based on the current date
3. The next upcoming event is featured prominently in the hero section
4. All events are listed in the events section with appropriate labels
5. If the API request fails, the site falls back to using local event data from `src/data/events.json`

<!-- ## CORS Challenges & Solutions

Due to browser security restrictions (CORS), directly accessing the Meetup API from a browser is not allowed. Three solutions are provided:

### Option 1: CORS Anywhere Proxy (Development Only)

For development and testing, the site uses the CORS Anywhere proxy:
```javascript
const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
const directMeetupUrl = `${corsAnywhereUrl}https://api.meetup.com/${groupUrlName}/events?...`;
```

**⚠️ This is not recommended for production use!**

### Option 2: Custom Netlify Proxy (Recommended)

A serverless function is provided in the `meetup-proxy` directory that can be deployed to Netlify:

1. Deploy the proxy function following the instructions in `meetup-proxy/README.md`
2. Update the API URL in `src/js/main.js`:
```javascript
// Replace this:
const meetupApiUrl = directMeetupUrl;

// With this:
const meetupApiUrl = netlifyProxyUrl;
```

### Option 3: Server-Side Rendering

If you're using a more complex architecture, consider fetching the Meetup data server-side and either:
- Embedding it directly in the initial HTML
- Making it available via your own API endpoint

## Setup Instructions

1. **Deploy the Netlify Proxy Function:**
   - Navigate to the `meetup-proxy` directory
   - Follow the deployment instructions in the README
   - Note the URL of your deployed Netlify site

2. **Update the API URL in the Main Website:**
   - Open `src/js/main.js`
   - Locate the "API URL configuration" section
   - Update the `netlifyProxyUrl` with your Netlify function URL
   - Change the `meetupApiUrl` assignment to use `netlifyProxyUrl`

3. **Deploy the Main Website**

## Troubleshooting

### Events Not Loading

If events are not loading from Meetup:

1. Check browser console for errors
2. Verify the Meetup group URL name is correct (`roanoke-valley-net-user-group`)
3. Test the proxy function directly by visiting: `https://your-netlify-site.netlify.app/api/meetup-events`
4. Verify Meetup API hasn't changed (check [Meetup API documentation](https://www.meetup.com/api/)) -->

### Fallback to Local Data

If the Meetup API request fails, the site will automatically fall back to using local event data. Keep this data updated to ensure a good user experience even during API outages:

1. Periodically update `src/data/events.json` with the latest events from Meetup
2. Follow the format described in `UPDATING.md`

## Customization

### Changing the Meetup Group

To connect to a different Meetup group:

1. Update the `groupUrlName` variable in `src/js/main.js`:
```javascript
const groupUrlName = 'your-meetup-group-name';
```

### Adjusting Event Display

To modify how events are displayed:

1. Edit the `createEventCard` function in `src/js/main.js` to change event card layout
2. Edit the `updateNextEventSection` function to change the featured event display

## Maintenance

The Meetup API occasionally changes. If integration breaks:

1. Check the [Meetup API documentation](https://www.meetup.com/api/) for changes
2. Update the code to match any new API formats
3. Test thoroughly before deploying

## Future Enhancements

Potential improvements to consider:

1. Add caching to the proxy function to reduce API calls
2. Implement a scheduled task to periodically pre-fetch and cache events
3. Add more detailed event information (attendees, comments, etc.)
4. Improve error handling and user feedback

---

For questions or assistance, contact the website administrator. 