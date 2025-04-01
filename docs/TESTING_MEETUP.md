# Testing the Meetup API Integration

This document provides a step-by-step guide to test the Meetup API integration for the RVNUG website.

## Development Testing

### 1. Test the Direct CORS Anywhere Approach

1. Open the browser's developer console (F12 or right-click > Inspect > Console)
2. Verify the following request in the Network tab:
   ```
   https://cors-anywhere.herokuapp.com/https://api.meetup.com/roanoke-valley-net-user-group/events
   ```
3. If you see CORS errors, you may need to request temporary access to the CORS Anywhere demo server:
   - Visit: https://cors-anywhere.herokuapp.com/corsdemo
   - Click the "Request temporary access to the demo server" button
   - Reload your page and try again

### 2. Test the Netlify Proxy Function

1. Navigate to the `meetup-proxy` directory:
   ```
   cd meetup-proxy
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Netlify development server:
   ```
   npx netlify-cli dev
   ```

4. Once running, test the function in your browser:
   ```
   http://localhost:8888/api/meetup-events?group=roanoke-valley-net-user-group
   ```

5. You should see a JSON response with event data from Meetup

6. Update the `src/js/main.js` file to use the local proxy:
   ```javascript
   // Change this:
   const meetupApiUrl = directMeetupUrl;
   
   // To this:
   const netlifyProxyUrl = `http://localhost:8888/api/meetup-events?group=${groupUrlName}`;
   const meetupApiUrl = netlifyProxyUrl;
   ```

7. Refresh your website and check if events are loading

## Production Testing

### 1. Deploy the Netlify Function

1. Deploy your Netlify function following the instructions in `meetup-proxy/README.md`

2. Test the production function:
   ```
   https://your-netlify-site.netlify.app/api/meetup-events?group=roanoke-valley-net-user-group
   ```

3. Update the `src/js/main.js` file to use the production proxy:
   ```javascript
   const netlifyProxyUrl = `https://your-netlify-site.netlify.app/api/meetup-events?group=${groupUrlName}`;
   const meetupApiUrl = netlifyProxyUrl;
   ```

4. Deploy the main website to GitHub Pages

5. Test the live site to verify events are loading correctly

### 2. Verify Fallback Mechanism

To test the fallback mechanism:

1. Temporarily modify the Netlify proxy URL to be incorrect:
   ```javascript
   const netlifyProxyUrl = `https://your-netlify-site.netlify.app/api/wrong-path?group=${groupUrlName}`;
   ```

2. Refresh the page
   
3. You should see a message indicating that the site is falling back to local data
   
4. Verify that events from `src/data/events.json` are being displayed

5. Restore the correct URL when done testing

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Look for messages like "Access to fetch at X from origin Y has been blocked by CORS policy"
   - Make sure your proxy is setting the correct CORS headers
   - Verify that the proxy is correctly forwarding the request to Meetup

2. **Network Errors**
   - Check that your Netlify function is deployed correctly
   - Verify the proxy URL is correct
   - Check Netlify function logs for errors

3. **Empty Events List**
   - Verify that the Meetup group has events
   - Check that the group name is correct
   - Test the API directly in a browser to see the response

4. **Parse Errors**
   - Look for "Unexpected token" errors in the console
   - Verify that the proxy is returning valid JSON
   - Check if the Meetup API response format has changed

## Advanced Testing

### Simulating Different Time Scenarios

To test how the site handles events on different dates:

1. Modify the "now" variable in `loadEventsFromMeetup()` to simulate different dates:
   ```javascript
   // Change this:
   const now = new Date();
   
   // To test a specific date:
   const now = new Date('2025-05-01T00:00:00');
   ```

2. This allows you to see how the site will display events at different points in time

3. Remember to change it back to `new Date()` when done testing

### Load Testing (Optional)

If you're concerned about rate limits or performance:

1. Use a tool like Apache Bench or Lighthouse to test performance
2. Add caching to your Netlify function to reduce API calls
3. Consider implementing a more sophisticated caching strategy for production 