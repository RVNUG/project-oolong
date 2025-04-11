# Meetup Integration

This document covers both implementation and testing of the Meetup integration for the RVNUG website.

## Overview

The website uses a multi-layered approach to fetch and display Meetup events:

1. **Primary Method**: GitHub Actions with Playwright
   - Automated daily scraping of Meetup website
   - No API key required
   - Data stored in repository

2. **Fallback Methods**:
   - Local JSON data
   - Browser-side JSONP API calls
   - Cached data from previous fetches

## Implementation

### GitHub Actions Integration

The Meetup integration runs daily through GitHub Actions:

1. **Workflow Configuration** (`update_meetup_events.yml`):
```yaml
on:
  schedule:
    - cron: '0 1 * * *'  # Daily at 1:00 AM UTC
  workflow_dispatch:
```

2. **Playwright Script** (`scripts/meetup_events.py`):
```python
async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    page = await context.new_page()
    
    # Scrape both past and upcoming events
    await page.goto(f"https://www.meetup.com/{group_name}/events")
    events = await scrape_events_from_page(page)
```

### Data Storage

Events are stored in `public/data/events.json`:
```json
{
  "events": [
    {
      "id": "unique-event-id",
      "title": "Event Title",
      "description": "Event Description",
      "date": "2024-04-01T19:00:00Z",
      "venue": {
        "name": "Venue Name",
        "address": "Venue Address",
        "city": "Roanoke",
        "state": "VA"
      },
      "isOnline": false,
      "url": "https://www.meetup.com/event-url"
    }
  ]
}
```

## Testing

### Local Development Testing

1. **Setup Environment**:
```bash
# Install dependencies
pip install requests python-dotenv playwright

# Install Playwright browser
python -m playwright install chromium
```

2. **Run Scraper Locally**:
```bash
python scripts/meetup_events.py
```

3. **Debug Mode**:
```bash
MEETUP_DEBUG=true python scripts/meetup_events.py
```

### Production Testing

1. **Verify GitHub Actions**:
   - Check Actions tab in GitHub repository
   - Review workflow runs for `update_meetup_events.yml`
   - Verify JSON file updates

2. **Test Website Display**:
   - Check events page loads correctly
   - Verify event details are accurate
   - Test responsive design
   - Check online/in-person detection

### Testing Different Scenarios

1. **Empty Events**:
```javascript
// In src/components/Events.tsx
if (!events.length) {
  return <div>No upcoming events scheduled. Check back soon!</div>;
}
```

2. **API Failures**:
```javascript
try {
  const events = await fetchEvents();
} catch (error) {
  console.error('Failed to fetch events:', error);
  return fallbackEvents;
}
```

## Troubleshooting

### Common Issues

1. **Scraping Failures**:
   - Check Meetup website structure changes
   - Review Playwright selectors
   - Enable debug mode for detailed logs
   - Verify network connectivity

2. **Data Issues**:
   - Validate JSON format
   - Check event date parsing
   - Verify venue information
   - Test online/in-person detection

3. **Display Issues**:
   - Check React component rendering
   - Verify CSS styles
   - Test responsive breakpoints
   - Review console errors

### Debug Tools

1. **Playwright Debug Mode**:
```bash
MEETUP_DEBUG=true python scripts/meetup_events.py
```
- Saves screenshots
- Creates HTML dumps
- Logs selector matches
- Records network requests

2. **Browser Developer Tools**:
- Network tab for API calls
- Console for JavaScript errors
- React DevTools for component debugging
- Network throttling for performance testing

## Maintenance

### Regular Tasks

1. **Monitor Changes**:
   - Watch for Meetup website updates
   - Review scraping success rate
   - Check data quality
   - Update selectors if needed

2. **Update Test Data**:
   - Keep sample events current
   - Update test scenarios
   - Maintain fallback data
   - Document changes

### Future Improvements

1. **Reliability**:
   - Add retry mechanisms
   - Improve error handling
   - Enhance logging
   - Implement monitoring

2. **Features**:
   - Add event categories
   - Improve search
   - Enhanced filtering
   - ✅ Calendar integration (Implemented! See `Feature_AddToCalendarBtn.md`)
     - Custom dropdown menu for calendar options
     - Support for Google, Apple, Outlook, Yahoo calendars
     - Direct .ics file download option
     - Proper timezone handling

## Resources

- [Playwright Documentation](https://playwright.dev/python/)
- [Meetup Events API](https://www.meetup.com/api/guide/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Documentation](https://react.dev/) 