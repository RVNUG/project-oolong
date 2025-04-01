# RVNUG Website - GitHub Pages Integration

This document explains the integration of various APIs and services with the RVNUG website hosted on GitHub Pages.

## Overview

The website uses GitHub Pages for hosting and GitHub Actions for automated deployment and data updates. This setup provides:

1. Automated builds and deployments
2. Daily YouTube video updates
3. Daily Meetup events updates
4. Resilient fallback mechanisms for API failures
5. Headless browser scraping for Meetup events
6. Required build verification for pull requests

## GitHub Actions Workflows

### 1. Main Deployment Workflow (deploy.yml)

This workflow handles the main deployment process:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

Features:
- Separates verification and deployment into distinct jobs
- Builds the React application
- Updates YouTube data
- Updates Meetup events data
- Deploys to GitHub Pages (only on main branch)
- Runs on pull requests for testing
- Manual trigger support

### 2. Pull Request Checks Workflow (pr-checks.yml)

This workflow verifies pull requests before they can be merged:

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

Features:
- Runs build verification to ensure the project builds successfully
- Performs TypeScript checks to catch type errors
- Required to pass before PRs can be merged
- Provides fast feedback to contributors

### 3. YouTube Data Updates (update_yt_videos.yml)

This workflow handles daily YouTube data updates:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:
```

Features:
- Fetches latest videos from RVNUG YouTube channel
- Updates `public/data/videos.json`
- Runs automatically daily
- Manual trigger support

### 4. Meetup Events Updates (update_meetup_events.yml)

This workflow handles daily Meetup events updates:

```yaml
on:
  schedule:
    - cron: '0 1 * * *'  # Daily at 1:00 AM UTC
  workflow_dispatch:
```

Features:
- Uses Playwright to scrape Meetup events directly from the website
- No API key required
- Updates `public/data/events.json`
- Does not save empty data if scraping fails (keeps existing data intact)
- Runs automatically daily
- Manual trigger support

## Branch Protection and Pull Request Process

The repository uses GitHub's branch protection rules to ensure code quality:

### Branch Protection Rules

1. **Required Status Checks**:
   - All pull requests must pass build verification before merging
   - TypeScript checks must pass to ensure type safety

2. **Merge Requirements**:
   - Pull requests must be up to date with the base branch
   - Required reviews must be approved

### Pull Request Process

1. **Create a Feature Branch**:
   - Branch off from `main` with a descriptive name
   - Make changes and commit them to your branch

2. **Open a Pull Request**:
   - Create a PR targeting the `main` branch
   - GitHub Actions automatically runs verification checks

3. **Review and Approval**:
   - Wait for verification checks to complete
   - Address any failed checks or requested changes
   - Get approvals from maintainers

4. **Merge**:
   - Once approved and all checks pass, the PR can be merged
   - After merging, the deployment workflow runs automatically

## API Integration Solutions

### 1. Meetup Events Integration

The Meetup integration uses a multi-layered approach to ensure data is always available:

#### Approach 1: Playwright Web Scraping (Primary Method)

This approach uses a headless browser to scrape Meetup events directly from the website:

1. GitHub Actions runs the `scripts/meetup_events.py` script daily
2. The script uses Playwright to open a headless browser
3. It navigates to the Meetup group page and extracts event information using current selectors
4. Event data is cleaned and processed (removing extraneous text, proper date formatting)
5. Events are identified as online or in-person automatically
6. Data is saved to `public/data/events.json`
7. If scraping fails, no new data is created and existing data is preserved

Benefits:
- No API key required
- Resilient to API changes
- Maintains existing data when scraping fails
- Data is cached in the repository
- Adapts to Meetup website structure changes

Implementation:
```python
async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    context = await browser.new_context(viewport={'width': 1280, 'height': 800})
    page = await context.new_page()
    
    # Navigate to Meetup page with updated selectors
    await page.goto(f"https://www.meetup.com/{group_name}/events/?type=past")
    
    # Extract event data using current selectors
    # We now support both past and upcoming events
    past_events = await scrape_events_from_page(page, "past")
    upcoming_events = await scrape_events_from_page(page, "upcoming")
```

Debug support:
- Set `MEETUP_DEBUG=true` to enable debug mode
- Saves screenshots and HTML dumps for troubleshooting
- Debug files help identify selector changes if Meetup updates their website

#### Approach 2: Browser-side API Calls (Fallback)

If loading the JSON file fails, the frontend falls back to these methods:

1. **JSONP API**: Uses Meetup's JSONP support to avoid CORS issues
2. **CORS Proxy**: If JSONP fails, attempts to use a CORS proxy
3. **Sample Data**: If all API calls fail, uses embedded sample data

### 2. YouTube API Integration

The YouTube integration uses the Data API v3 with automated updates:

1. **Local Development**:
   - Set up environment variables in `.env`:
     ```
     YOUTUBE_DATA_API_KEY=your_api_key
     YOUTUBE_CHANNEL_ID=your_channel_id
     ```

2. **Production**:
   - GitHub Actions handles daily updates
   - Data stored in `public/data/videos.json`
   - Fallback to cached data if API fails

## Data Flow Architecture

The website now follows this data flow pattern:

1. **Primary Data Source**: Local JSON files
   - `public/data/videos.json`: YouTube videos
   - `public/data/events.json`: Meetup events

2. **Automated Updates**:
   - GitHub Actions workflows run daily
   - Python scripts fetch fresh data
   - Updates committed to repository

3. **Fallback Mechanism**:
   - If local JSON fails, try JSONP (for Meetup)
   - If JSONP fails, try CORS proxy (for Meetup)
   - If all methods fail, maintain existing data

This architecture ensures:
- Data is always available
- Minimal API calls from user browsers
- No need for API keys in browser code
- Resilience against API changes or outages

## Playwright Setup for GitHub Actions

The GitHub Actions workflows are configured to install and use Playwright:

```yaml
- name: Install Python dependencies
  run: |
    python -m pip install --upgrade pip
    pip install requests python-dotenv playwright

- name: Install Playwright browsers
  run: |
    python -m playwright install chromium

- name: Get Meetup events
  env:
    MEETUP_GROUP_NAME: ${{ secrets.MEETUP_GROUP_NAME || 'roanoke-valley-net-user-group' }}
  run: |
    python scripts/meetup_events.py
```

## Testing

### Local Development

1. Install Playwright and browser:
   ```bash
   pip install playwright
   python -m playwright install chromium
   ```

2. Run the Meetup scraper:
   ```bash
   python scripts/meetup_events.py
   ```

3. For debugging, enable debug mode:
   ```bash
   MEETUP_DEBUG=true python scripts/meetup_events.py
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Verify builds locally before submitting PRs:
   ```bash
   npm run build
   ```

### Pull Request Testing

1. Create a pull request
2. GitHub Actions will:
   - Run the build verification job
   - Perform TypeScript checks
   - Report status directly on the PR
   - Block merging if any checks fail

3. Review the build results in the Actions tab

## Troubleshooting

### Common Issues

1. **Build Verification Issues**:
   - Check the error messages in the GitHub Actions logs
   - Try building locally with `npm run build` to reproduce the issue
   - Fix TypeScript errors and re-push the changes

2. **Playwright Scraping Issues**:
   - Check GitHub Actions logs for scraping errors
   - Try running the script locally with debug mode: `MEETUP_DEBUG=true python scripts/meetup_events.py`
   - Examine screenshots and HTML dumps in debug mode to identify what changed
   - Adjust selectors if Meetup website changes
   - Verify that retry logic is working correctly

3. **API Issues**:
   - Check browser console for errors
   - Verify API keys and permissions
   - Test API endpoints directly

4. **Deployment Issues**:
   - Ensure main branch permissions
   - Check GitHub Pages settings
   - Verify workflow file syntax

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Playwright Documentation](https://playwright.dev/python/)
- [Meetup Website](https://www.meetup.com/)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)

## Base URL Configuration

The website is configured to run under the `/rvnugorg_rewrite2025` base URL path. This is important for GitHub Pages deployment and local development:

1. **Environment Configuration**:
   ```bash
   # In .env file
   VITE_APP_BASE_URL=/rvnugorg_rewrite2025
   ```

2. **React Router Setup**:
   ```typescript
   // In App.tsx
   const basename = import.meta.env.VITE_APP_BASE_URL || '/rvnugorg_rewrite2025';
   
   function App() {
     return (
       <Router basename={basename}>
         {/* ... */}
       </Router>
     );
   }
   ```

3. **Link Usage**:
   - Always use React Router's `Link` component for internal navigation
   - The base URL is automatically handled by React Router
   - Regular `<a>` tags must include the full path with base URL

4. **Asset References**:
   - Static assets in `public/` are automatically served under the base URL
   - Use relative paths in your code to ensure proper asset loading

5. **Development Server**:
   - Local development server will serve the app at:
     `http://localhost:5173/rvnugorg_rewrite2025`

6. **Production Build**:
   - The build process automatically handles the base URL configuration
   - All asset paths are correctly prefixed with the base URL

</rewritten_file> 