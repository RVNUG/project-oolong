# Updating the RVNUG Website

This document provides instructions for updating the content of the RVNUG website.

## Events Management

### Primary Method: Using Meetup

The website now automatically pulls event data directly from the RVNUG Meetup page:
[https://www.meetup.com/roanoke-valley-net-user-group/](https://www.meetup.com/roanoke-valley-net-user-group/)

To add or update events:
1. Log in to Meetup
2. Create or edit events on the RVNUG Meetup page
3. The website will automatically display these events

Benefits:
- Single source of truth for event information
- Automatic synchronization between Meetup and website
- RSVP management through Meetup's platform

### Fallback Method: Manual JSON Update

In case the Meetup integration is not working, you can update the fallback events data:

1. Edit the file `src/data/events.json`
2. Add new events or modify existing ones using the following format:

```json
{
  "id": 5,  // Use a unique ID
  "title": "Your Event Title",
  "date": "2025-10-19T18:00:00",  // ISO format date (YYYY-MM-DDThh:mm:ss)
  "time": "6:00 PM - 8:00 PM",
  "location": "Event Location",
  "description": "Description of the event",
  "speaker": {
    "name": "Speaker Name",
    "bio": "Speaker bio",
    "image": "speaker-image.jpg"  // Place image in src/images/team/
  },
  "rsvpLink": "https://meetup.com/rvnug/events/your-event-id",
  "calendarLink": "#calendar-link"
}
```

3. Commit and push your changes to GitHub

## Updating Team Members

To update the team members displayed on the website:

1. Edit the file `src/data/team.json`
2. Add new team members or modify existing ones using the following format:

```json
{
  "id": 6,  // Use a unique ID
  "name": "Team Member Name",
  "role": "Team Member Role",
  "bio": "Team member bio",
  "image": "team-member.jpg",  // Place image in src/images/team/
  "linkedin": "https://linkedin.com/in/team-member",  // Optional
  "twitter": "https://twitter.com/team-member",  // Optional
  "github": "https://github.com/team-member"  // Optional
}
```

3. Commit and push your changes to GitHub

## Updating Sponsors

To update the sponsors displayed on the website:

1. Edit the file `src/data/sponsors.json`
2. Add new sponsors or modify existing ones using the following format:

```json
{
  "id": 7,  // Use a unique ID
  "name": "Sponsor Name",
  "level": "Platinum/Gold/Silver/Bronze",  // Sponsorship level
  "description": "Description of the sponsor",
  "logo": "sponsor-logo.svg",  // Place logo in src/images/sponsors/
  "website": "https://sponsor-website.com/"
}
```

3. Commit and push your changes to GitHub

## Adding Images

When adding new images:

1. Make sure images are web-optimized (compressed, appropriate dimensions)
2. Place images in the appropriate directory:
   - Team members: `src/images/team/`
   - Sponsors: `src/images/sponsors/`
   - Other images: `src/images/`
3. Use descriptive file names, avoiding spaces (use hyphens instead)
4. Commit and push your changes to GitHub

## Updating SEO Information

The website now includes comprehensive search engine optimization features. Here's how to update the SEO information for each page:

### General SEO Structure

Each page has customized SEO metadata managed through the `SEO` component, which provides:
- Page title and description
- Keywords for search engines
- Open Graph tags for social media sharing
- Twitter Card metadata
- Canonical URLs
- Custom robots directives

### Updating Page-Specific SEO

To update SEO information for a specific page:

1. Locate the page component in `src/pages/`
2. Find the `<SEO>` component within the page
3. Update the relevant properties:

```jsx
<SEO
  title="Your Updated Title - Roanoke Valley .NET User Group (RVNUG)"
  description="Your updated meta description for search engines."
  keywords="keyword1, keyword2, keyword3"
  pathName={location.pathname}
/>
```

### SEO Component Properties

The SEO component accepts the following properties:

- `title`: The page title (appears in browser tabs and search results)
- `description`: Meta description for search results
- `keywords`: Keywords for search engines
- `ogTitle`: Custom Open Graph title (defaults to title if not provided)
- `ogDescription`: Custom Open Graph description (defaults to description if not provided)
- `ogImage`: Image URL for social media sharing
- `ogType`: Content type (e.g., "website", "article", "event")
- `pathName`: Current page path (used for canonical URL)
- `robots`: Custom robots directive (defaults to "index, follow")

### Updating SEO Images

To update the images used for social media sharing:

1. Place your optimized image in `public/images/`
2. Update the `ogImage` property in the SEO component for the relevant page

The default image is the RVNUG logo located at `/images/roanoke-star-128-logo.png`.

### Environment Configuration

The SEO component uses environment variables for domain configuration:

- `VITE_DOMAIN_URL`: Set in `.env` to specify the production domain (default: "https://rvnug.org")
- `VITE_APP_BASE_URL`: Base URL path (default: "/rvnugorg_rewrite2025")

Important: All internal links in the application should use React Router's `Link` component instead of regular `<a>` tags to ensure proper handling of the base URL. For example:

```jsx
// Correct - will automatically handle the base URL
import { Link } from 'react-router-dom';
<Link to="/contact">Contact Us</Link>

// Incorrect - will not handle the base URL properly
<a href="/contact">Contact Us</a>
```

If you need to use a regular `<a>` tag for any reason, make sure to include the base URL:

```jsx
<a href="/rvnugorg_rewrite2025/contact">Contact Us</a>
```

## Website Colors and Styles

The website uses CSS variables for consistent styling. If you need to change the color scheme:

1. Edit the file `src/css/styles.css`
2. Modify the CSS variables in the `:root` section at the top of the file
3. Commit and push your changes to GitHub

## Community Showcase Projects

The Community Showcase features projects from the .NET community. To update project information:

1. Edit the file `src/hooks/useProjects.ts`
2. Add new projects or modify existing ones using the following format:

```typescript
{
  id: 7,  // Use a unique ID
  title: "Project Title",
  description: "Description of the project",
  author: "Project Author",
  authorUrl: "https://github.com/author",
  projectUrl: "https://github.com/author/project",
  imageUrl: getProjectImagePath("project-image.svg"),  // Use the helper function
  tags: ["tag1", "tag2", "tag3"]
}
```

### Project Images

For project images in the Community Showcase:

1. Place project images in `public/images/projects/`
2. Images should be in SVG, PNG, or JPG format
3. For best results, use images with a 16:9 aspect ratio
4. If no image is available, the system will use a default fallback image that displays the project title with a code icon and a styled gradient background

To modify the default fallback image:
1. Edit `public/images/projects/default-project.svg`
2. To customize the fallback styles, edit the CSS in `src/assets/css/project-card.css`

### How the Project Image Fallback Works

The Community Showcase features a robust image fallback mechanism that ensures a visually appealing display even when project images fail to load:

1. The `ProjectCard` component includes error handling for image loading:
   - Each project image has an `onError` handler that triggers when the image fails to load
   - When an error occurs, the component displays a styled fallback that includes:
     - A code icon (`<i className="fas fa-code">`)
     - The project title
     - A gradient background that matches the site's color scheme

2. The fallback styling is defined in `src/assets/css/project-card.css` with:
   - Responsive design that maintains proper card dimensions
   - Gradient backgrounds that adapt to both light and dark themes
   - Text formatting to ensure readability and prevent overflow
   - Animation and hover effects consistent with the regular project cards

3. The default SVG image (`public/images/projects/default-project.svg`) serves as an initial fallback before the component's error handling takes over

This approach provides multiple layers of fallback support, ensuring that the Community Showcase maintains a professional appearance regardless of image availability issues.

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Need More Help?

For detailed information about the Meetup API integration, see the [GITHUB_PAGES_INTEGRATION.md](GITHUB_PAGES_INTEGRATION.md) file.

Contact the website administrator for more advanced changes or assistance.

## Feature Flag Management

The website uses a feature flag system to control the availability of certain features. This allows for easy enabling/disabling of features in different environments.

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

3. Restart your development server for changes to take effect

### Production Environment

Feature flags in production are managed through GitHub Secrets:

1. Go to your repository's Settings > Secrets and variables > Actions
2. Add or update the following secrets:
   - `FEATURE_COMMUNITY_SHOWCASE`: Set to `true` to enable the Community Showcase feature

Note: If a feature flag secret is not set or set to any value other than `true`, the feature will be disabled in production.

### Current Feature Flags

| Flag Name | Environment Variable | GitHub Secret | Description |
|-----------|---------------------|---------------|-------------|
| Community Showcase | `VITE_FEATURE_COMMUNITY_SHOWCASE` | `FEATURE_COMMUNITY_SHOWCASE` | Controls the Community Showcase page, navigation links, and related features |

### How Feature Flags Work

1. **Build Time**:
   - Features are conditionally compiled based on flag values
   - When a feature is disabled, its files are excluded from the build
   - This reduces the bundle size by removing unused code

2. **Runtime**:
   - Navigation items are automatically hidden for disabled features
   - Routes are conditionally rendered based on feature status
   - Components can check feature status using the `isFeatureEnabled` function

3. **Using Feature Flags in Code**:

```typescript
import { Feature, isFeatureEnabled } from '../config/featureFlags';

// Check if a feature is enabled
if (isFeatureEnabled(Feature.COMMUNITY_SHOWCASE)) {
  // Feature-specific code
}

// Conditionally render components
{isFeatureEnabled(Feature.COMMUNITY_SHOWCASE) && (
  <YourComponent />
)}

// Use the withFeature helper
const MaybeComponent = withFeature(Feature.COMMUNITY_SHOWCASE, YourComponent);
```

### Adding New Feature Flags

To add a new feature flag:

1. Add the environment variable to `.env.example`:
```bash
VITE_FEATURE_YOUR_FEATURE=true
```

2. Update the Feature enum in `src/config/featureFlags.ts`:
```typescript
export enum Feature {
  COMMUNITY_SHOWCASE = 'COMMUNITY_SHOWCASE',
  YOUR_FEATURE = 'YOUR_FEATURE',  // Add your feature
}
```

3. Add the feature flag to the GitHub workflow:
   - Update `.github/workflows/deploy.yml`
   - Add the environment variable and secret

4. Update documentation:
   - Add the new feature flag to this document
   - Update the README.md if necessary 