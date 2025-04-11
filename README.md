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
└── main.tsx         # Entry point
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Python 3.11 (for local development of API scripts)
- Playwright (for Meetup scraping)

### Installation

1. Clone the repository
```bash
git clone https://github.com/rvnug/project-oolong.git
cd project-oolong
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables
```bash
cp .env.example .env
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

6. Open your browser and navigate to http://localhost:5173/

## Development Workflow

### Branch Protection

The repository is configured with branch protection rules to ensure code quality:

1. **Required Status Checks**:
   - All pull requests must pass build verification before merging
   - TypeScript checks must pass to ensure type safety
   
2. **Pull Request Process**:
   - Create a feature branch from `master`
   - Make your changes and commit them
   - Open a pull request to `master`
   - Automated checks will run to verify the build
   - Once approved and all checks pass, the PR can be merged

3. **Post-Merge**:
   - After merging to `master`, the deployment workflow automatically runs
   - The site is built and deployed to GitHub Pages
   - External API data is updated

## Feature Flag Management

The website uses a feature flag system to control the availability of certain features:

### Local Development

To manage feature flags during local development:

1. Copy `.env.example` to `.env` if you haven't already:
```bash
cp .env.example .env
```

2. Edit your `.env` file to enable/disable features:
```bash
# Feature Flags
VITE_FEATURE_COMMUNITY_SHOWCASE=true  # Set to false to disable
```

### Production Environment

Feature flags in production are managed through GitHub Secrets:

1. Go to your repository's Settings > Secrets and variables > Actions
2. Add or update the following secrets:
   - `FEATURE_COMMUNITY_SHOWCASE`: Set to `true` to enable the Community Showcase feature

## Deployment

The website is deployed to GitHub Pages using GitHub Actions. The deployment process includes:

1. **Automated Builds**: Triggered on:
   - Push to master branch
   - Pull requests to master branch
   - Manual workflow dispatch
   - Specifically triggered when data files are updated in master

2. **Data Updates**:
   - YouTube videos are automatically fetched and updated daily
   - Meetup events are automatically scraped and updated daily
   - Data is stored in `public/data/` directory as JSON files

3. **Deployment Process**:
   - Verifies the build succeeds (required to pass before merging)
   - Updates external API data
   - Deploys to GitHub Pages (only on master branch)

## Additional Documentation

- [Branch Protection Setup](docs/branch-protection-setup.md): Details on branch protection rules
- [Meetup Integration](docs/MEETUP_INTEGRATION.md): Information on Meetup API integration
- [GitHub Pages Integration](docs/GITHUB_PAGES_INTEGRATION.md): Details on GitHub Pages deployment
- [Migration Plan](docs/MIGRATION_2025.md): Current migration status and plan
- [SEO Documentation](docs/SEO_DOCUMENTATION.md): Comprehensive guide to the SEO implementation
- [Component Documentation](docs/components/): Details on specific component implementations
  - [EventCalendarButton](docs/components/EVENT_CALENDAR_BUTTON.md): Calendar integration component

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Team

- RVNUG Development Team