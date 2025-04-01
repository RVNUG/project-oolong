# Roanoke Valley .NET User Group Website

This is the official website for the Roanoke Valley .NET User Group (RVNUG), a community of developers passionate about .NET technologies in the Roanoke Valley area.

## Technologies Used

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **React Router**: For client-side routing
- **React Helmet Async**: For managing document head and SEO metadata
- **ESLint v9**: Code quality and style checking with flat config
- **CSS**: Custom styling
- **YouTube API**: For fetching latest videos from our channel
- **GitHub Actions**: For automated deployment and data updates
- **Playwright**: For headless browser automation to scrape Meetup events

## Project Structure

```
src/
├── assets/
│   ├── css/          # Stylesheets
│   └── images/       # Images and icons
├── components/       # Reusable UI components
│   └── SEO.tsx       # SEO component for managing meta tags
├── config/          # Configuration files
│   └── featureFlags.ts # Feature flag configuration
├── data/             # JSON data files
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # API and data fetching services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   └── seo.ts        # SEO utility functions
├── App.tsx           # Main App component
└── main.tsx          # Entry point
```

## Linting with ESLint

The project uses ESLint v9 with its new flat configuration format for linting JavaScript and TypeScript files. The ESLint configuration helps maintain consistent code quality and prevents common errors.

### Configuration

The ESLint setup is defined in `eslint.config.js` and includes:

- TypeScript support via `typescript-eslint`
- React-specific rules via `eslint-plugin-react` and `eslint-plugin-react-hooks`
- Fast Refresh optimization with `eslint-plugin-react-refresh`
- Global environment settings for browser and Node.js
- Custom rules for controlling console statements and handling TypeScript types

### Running ESLint Locally

```bash
# Run ESLint on the entire project
npm run lint

# Fix automatically fixable issues
npm run lint -- --fix
```

### CI Integration

ESLint is integrated into the CI pipeline via GitHub Actions. The `pr-checks.yml` workflow:

1. Runs ESLint on all pull requests
2. Adds detailed annotations to PR for any issues found
3. Blocks PR merging if there are ESLint errors (warnings are allowed)
4. Provides a summary of error and warning counts

Pull requests must pass ESLint checks before they can be merged, ensuring code quality standards are maintained.

## Features

- **Event Management**: Display upcoming and past events from Meetup
- **Team Directory**: Showcase the RVNUG leadership team
- **Sponsor Showcase**: Display and categorize sponsors by level
- **Feature Flags**: Control feature availability through environment variables and GitHub Secrets
- **Responsive Design**: Mobile-friendly layout
- **SEO Optimization**: Comprehensive search engine optimization with meta tags, Open Graph, Twitter Card, and JSON-LD structured data support
- **Automated YouTube Updates**: Latest videos automatically fetched and updated daily
- **Automated Meetup Updates**: Events automatically scraped and updated daily
- **Online/In-Person Event Detection**: Events are automatically categorized as online or in-person
- **Quality Assurance**: Required build verifications on pull requests to maintain code quality
- **Project Card Image Fallback**: Graceful fallback for missing project images in the Community Showcase, displaying project title and code icon with a styled background

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Python 3.11 (for local development of API scripts)
- Playwright (for Meetup scraping)

### Installation

1. Clone the repository
```bash
git clone https://github.com/rvnug/rvnugorg_rewrite2025.git
cd rvnugorg_rewrite2025
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Note: The application uses a base URL of `/rvnugorg_rewrite2025` by default. This can be configured through the `VITE_APP_BASE_URL` environment variable in your `.env` file:

```bash
VITE_APP_BASE_URL=/rvnugorg_rewrite2025  # Default value
```

4. For local development of scripts:
```bash
pip install requests python-dotenv playwright
python -m playwright install chromium
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser and navigate to http://localhost:5173/rvnugorg_rewrite2025

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

The website is deployed to GitHub Pages using GitHub Actions. The deployment process includes:

1. **Automated Builds**: Triggered on:
   - Push to main branch
   - Pull requests to main branch
   - Manual workflow dispatch

2. **Data Updates**:
   - YouTube videos are automatically fetched and updated daily
   - Meetup events are automatically scraped and updated daily
   - Data is stored in `public/data/` directory as JSON files

3. **Deployment Process**:
   - Verifies the build succeeds (required to pass before merging)
   - Updates external API data
   - Deploys to GitHub Pages (only on main branch)

### GitHub Actions Workflows

- `.github/workflows/deploy.yml`: Main deployment workflow
- `.github/workflows/update_yt_videos.yml`: Daily YouTube data updates
- `.github/workflows/update_meetup_events.yml`: Daily Meetup events updates
- `.github/workflows/pr-checks.yml`: Pull request verification checks

## Development Workflow

### Branch Protection

The repository is configured with branch protection rules to ensure code quality:

1. **Required Status Checks**:
   - All pull requests must pass build verification before merging
   - TypeScript checks must pass to ensure type safety
   
2. **Pull Request Process**:
   - Create a feature branch from `main`
   - Make your changes and commit them
   - Open a pull request to `main`
   - Automated checks will run to verify the build
   - Once approved and all checks pass, the PR can be merged

3. **Post-Merge**:
   - After merging to `main`, the deployment workflow automatically runs
   - The site is built and deployed to GitHub Pages
   - External API data is updated

For more details, see [branch-protection-setup.md](docs/branch-protection-setup.md).

## Additional Documentation

- [Branch Protection Setup](docs/branch-protection-setup.md): Details on branch protection rules
- [Meetup Integration](docs/MEETUP_INTEGRATION.md): Information on Meetup API integration
- [GitHub Pages Integration](docs/GITHUB_PAGES_INTEGRATION.md): Details on GitHub Pages deployment
- [Testing Meetup](docs/TESTING_MEETUP.md): Guide for testing Meetup integration
- [Updating Content](docs/UPDATING.md): Instructions for updating website content
- [SEO Documentation](docs/SEO_DOCUMENTATION.md): Comprehensive guide to the SEO implementation

## API Integration

### Meetup Integration
The website integrates with Meetup using a multi-layered approach:

1. **Primary Method**: GitHub Actions uses Playwright to scrape Meetup events directly from the website
   - No API key required
   - Extracts events from both past and upcoming pages
   - Cleans and formats event titles and descriptions
   - Detects online vs. in-person events automatically
   - Events saved to `public/data/events.json`
   - Preserves existing data if scraping fails

2. **Fallback Methods**:
   - If local JSON fails, try JSONP API call from the browser
   - If JSONP fails, try using a CORS proxy
   - If all API methods fail, use existing cached data

This approach ensures:
- No API key needed
- No CORS issues
- Events are always available even if Meetup website changes
- Maintained data integrity with proper cleaning and formatting

#### Debug Mode

For troubleshooting the Meetup scraper, you can enable debug mode:

```bash
MEETUP_DEBUG=true python scripts/meetup_events.py
```

This will save screenshots and HTML dumps that help identify issues with the scraping process.

### YouTube API
The homepage features our latest YouTube videos using the YouTube Data API v3. The integration includes:

1. Automated daily updates via GitHub Actions
2. Fallback to cached data if API fails
3. Local development support

To set up YouTube API locally:

1. Create a Google Developer Console project
2. Enable the YouTube Data API v3
3. Create an API key with appropriate restrictions
4. Add your API key to `.env`:
```
YOUTUBE_DATA_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```