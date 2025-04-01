# GitHub Actions Workflows

This document describes the GitHub Actions workflows used for deployment and automation in the RVNUG website.

## Overview

The website uses GitHub Actions for:
- Automated builds and deployments to GitHub Pages
- Daily data updates (YouTube videos and Meetup events)
- Pull request verification
- Branch protection enforcement

## Workflow Files

### 1. Main Deployment Workflow (deploy.yml)

This workflow handles the main deployment process:

```yaml
on:
  push:
    branches: [master]
    paths:
      - 'public/data/videos.json'
      - 'public/data/events.json'
  pull_request:
    branches: [master]
  workflow_dispatch:
```

Features:
- Separates verification and deployment into distinct jobs
- Builds the React application
- Updates YouTube data
- Updates Meetup events data
- Deploys to GitHub Pages (only on master branch)
- Runs on pull requests for testing
- Manual trigger support
- Automatically triggered when data files are updated

### 2. Pull Request Checks (pr-checks.yml)

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

Features:
- Runs build verification
- Performs TypeScript checks
- Required to pass before PRs can be merged
- Provides fast feedback to contributors

### 3. YouTube Data Updates (update_yt_videos.yml)

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
- Triggers deployment workflow when new video data is pushed

### 4. Meetup Events Updates (update_meetup_events.yml)

```yaml
on:
  schedule:
    - cron: '0 1 * * *'  # Daily at 1:00 AM UTC
  workflow_dispatch:
```

Features:
- Uses Playwright to scrape Meetup events
- Updates `public/data/events.json`
- Preserves existing data if scraping fails
- Runs automatically daily
- Triggers deployment workflow when new event data is pushed

## Deployment Process

1. **Build Job**:
   ```yaml
   - name: Install dependencies
     run: npm ci --legacy-peer-deps
   
   - name: Create .env file
     run: |
       echo "VITE_APP_BASE_URL=/" >> .env
       echo "VITE_FEATURE_COMMUNITY_SHOWCASE=${FEATURE_COMMUNITY_SHOWCASE:-false}" >> .env
   
   - name: Build
     run: npm run build
   ```

2. **Deploy Job**:
   ```yaml
   - name: Deploy to GitHub Pages
     uses: actions/deploy-pages@v4
   ```

## Data Update Process

1. **YouTube Updates**:
   - Fetches latest videos using YouTube Data API
   - Updates JSON file in repository
   - Triggers deployment if changes detected

2. **Meetup Updates**:
   - Scrapes Meetup website using Playwright
   - Updates JSON file in repository
   - Triggers deployment if changes detected

## Environment Setup

### Required Secrets

- `GITHUB_TOKEN`: For repository access
- `YOUTUBE_DATA_API_KEY`: For YouTube API access
- `RVNUG_YT_CHANNEL_ID`: YouTube channel identifier
- `FEATURE_COMMUNITY_SHOWCASE`: Feature flag control

### Environment Variables

Set in workflow files or repository settings:
```yaml
env:
  NODE_VERSION: '20'
  PYTHON_VERSION: '3.11'
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors
   - Review GitHub Actions logs

2. **Data Update Failures**:
   - Verify API keys and permissions
   - Check Playwright installation
   - Review scraping selectors
   - Check for rate limiting

3. **Deployment Issues**:
   - Verify GitHub Pages settings
   - Check branch permissions
   - Review deployment logs

### Debug Mode

For Meetup scraping issues:
```bash
MEETUP_DEBUG=true python scripts/meetup_events.py
```

## Best Practices

1. **Pull Requests**:
   - Create feature branches from `master`
   - Wait for all checks to pass
   - Keep changes focused and documented
   - Test locally before pushing

2. **Workflow Maintenance**:
   - Regularly update action versions
   - Monitor workflow execution times
   - Review and update cron schedules
   - Keep dependencies current

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Playwright Documentation](https://playwright.dev/python/)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3) 