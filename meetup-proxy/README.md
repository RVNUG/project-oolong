# RVNUG Meetup Proxy

This is a simple proxy service for fetching Meetup events data. It was originally set up as a serverless function to handle CORS issues when accessing the Meetup API from the browser, but has now been replaced with a more robust solution.

## Current Approach

The RVNUG website now uses a multi-layered approach to fetch Meetup events:

1. **Primary Method**: GitHub Actions runs a Playwright-based scraper script that:
   - Directly extracts event data from the Meetup website
   - Saves the data to `public/data/events.json` in the main repository
   - Runs on a daily schedule to keep data fresh
   - Cleans and formats event data for consistency
   - Automatically detects online vs. in-person events

2. **Fallback Methods** (if local JSON data fails):
   - JSONP API call from the browser
   - CORS proxy service (like this one, but used as a fallback)
   - Cached data from previous successful fetches

This hybrid approach ensures that:
- We don't need to maintain a separate API key
- We don't run into CORS issues
- We have multiple fallback mechanisms
- Data is always available even if Meetup's website changes

## Recent Site Improvements

The RVNUG website has undergone several improvements to enhance user experience and ensure content availability:

1. **Meetup Event Integration**: As described above, a robust multi-layered approach for event data
2. **YouTube Video Integration**: Automated fetching and caching of latest videos
3. **Project Card Image Fallback**: The Community Showcase now includes a graceful fallback system for project images:
   - Custom SVG default image for projects without images
   - Error handling in the `ProjectCard` component to catch image loading failures
   - Styled fallback display with project title and code icon when images fail to load
   - Consistent styling in both light and dark themes

These improvements work together to ensure a seamless user experience across the site, even when external resources are unavailable.

## Integration with Main Project

This proxy service is part of the RVNUG website ecosystem:

1. **GitHub Actions Workflows**:
   - Main project uses automated workflows to build, test, and deploy
   - Pull requests require passing build verification before merging
   - All code changes are validated through TypeScript checks and build tests
   
2. **Quality Control**:
   - Changes to the proxy or scraper code must pass the same verification checks
   - Pull request process ensures code quality is maintained
   - Branch protection rules prevent merging if any required checks fail

## Legacy Information

This proxy service was previously the primary method for accessing Meetup data. It can still be used as a fallback mechanism if the primary scraping approach fails.

### How it works

The function accepts requests and proxies them to the Meetup API, adding the necessary CORS headers to make the response accessible from the browser.

### Local Development

1. Install dependencies
```
npm install
```

2. Start the local server
```
npm start
```

3. Access the API at `http://localhost:9000/.netlify/functions/meetup-proxy`

### Deployment

This service is deployed to Netlify and is accessible at: 
```
https://rvnug-meetup-proxy.netlify.app/.netlify/functions/meetup-proxy
```

### API Usage

To use this API, make a GET request to:
```
https://rvnug-meetup-proxy.netlify.app/.netlify/functions/meetup-proxy?group=roanoke-valley-net-user-group
```

Where `group` is the URL name of the Meetup group you want to fetch events for.

## Contributing

If you need to modify this proxy service:

1. Fork the repository and create a feature branch
2. Make your changes and test them locally
3. Open a pull request to the main repository
4. Wait for automated verification checks to pass
5. Address any issues or feedback
6. Once approved, your changes will be merged

## Maintenance Status

This proxy service is maintained as a fallback mechanism but is no longer the primary method for accessing Meetup data. The main RVNUG website now uses the Playwright-based scraper as the primary data source. 