# Search Engine Optimization (SEO) Documentation

This document provides detailed information about the SEO implementation in the RVNUG website.

## Overview

The RVNUG website implements comprehensive search engine optimization to improve visibility, enhance social media sharing, and provide better control over how search engines interact with our content. The implementation uses React Helmet Async for managing document head metadata and structured data (JSON-LD) for enhanced search engine understanding.

## Implementation Details

### Core Components

1. **SEO Component** (`src/components/SEO.tsx`)
   - Centralized component for managing all meta tags
   - Helmet implementation for document head management
   - Default values for common metadata
   - Support for page-specific overrides

2. **JsonLd Component** (`src/components/JsonLd.tsx`)
   - Component for adding structured data to pages
   - Uses Helmet to inject JSON-LD into the document head
   - Supports any valid Schema.org structured data

3. **SEO Utilities** (`src/utils/seo.ts`)
   - Functions for generating canonical URLs
   - Utilities for resolving absolute image URLs
   - Environment-aware base URL detection

4. **Structured Data Utilities** (`src/utils/structuredData.ts`)
   - Functions for generating Schema.org compliant structured data
   - Support for Organization, Website, Event, BreadcrumbList schemas
   - Dynamic data generation based on page content

5. **HelmetProvider** (in `src/App.tsx`)
   - Context provider for React Helmet Async
   - Wraps the entire application for consistent metadata management

### Metadata Implementation

Each page component includes an SEO component with page-specific metadata:

```tsx
<SEO
  title="Page Title - RVNUG"
  description="Page meta description for search engines."
  keywords="keyword1, keyword2, keyword3"
  ogImage="/images/custom-image.png"
  pathName={location.pathname}
  // Additional optional properties
/>
```

### Structured Data Implementation

Each page includes appropriate structured data using the JsonLd component:

```tsx
// Organization data on all pages (App.tsx)
<JsonLd data={createOrganizationStructuredData()} />

// Website data on all pages (App.tsx)
<JsonLd data={createWebsiteStructuredData()} />

// Breadcrumb navigation on individual pages
<JsonLd data={createBreadcrumbStructuredData([
  { name: 'Home', url: baseUrl },
  { name: 'Events', url: `${baseUrl}/events` }
])} />

// Event data on event pages
<JsonLd data={createEventStructuredData(event)} />
```

### SEO Features

Our implementation includes the following features:

#### Basic SEO
- Custom page titles
- Meta descriptions for search result snippets
- Keyword metadata for search relevance
- Language specification
- Author attribution

#### Canonical URLs
- Properly formatted canonical URLs to prevent duplicate content issues
- Environment-aware URL generation based on deployment context

#### Open Graph Protocol
- Title, description, and image for social media sharing
- Content type specification
- URL and site name properties
- Optimized for Facebook and other social platforms

#### Twitter Cards
- Summary card with large image format
- Custom title, description, and image
- Optimized for Twitter sharing

#### Robots Control
- Default indexing and following behavior
- Custom robots directives for special pages (e.g., noindex for 404 page)
- Revisit-after suggestion for search crawlers

#### Structured Data (JSON-LD)
- Organization information for entity recognition
- Website data for search features
- Event markup for event search features and rich results
- Breadcrumb navigation for improved site structure understanding
- ItemList for displaying collections (events) in search results

### Dynamic SEO Content

Some pages implement dynamic SEO content based on their data:

1. **Event Detail Page**
   - Title includes the event name
   - Description generated from event details
   - Type set to "event" for proper social sharing
   - Structured data with event details (time, location, etc.)
   - Breadcrumb navigation showing the page hierarchy

2. **Events Page**
   - List of events as structured data
   - Breadcrumb navigation
   - Different events shown based on active tab

3. **Other Pages**
   - Each page has custom breadcrumb structured data
   - Organization and website data on all pages

## Technical Implementation

### React Helmet Async

We use React Helmet Async instead of the older React Helmet for improved performance and to avoid memory leaks in server-side rendering scenarios. The HelmetProvider is configured at the application root:

```tsx
// App.tsx
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      {/* Application components */}
    </HelmetProvider>
  );
}
```

### JSON-LD Structured Data

We implement structured data using JSON-LD (JavaScript Object Notation for Linked Data), which is Google's preferred format. This is embedded in the page head:

```tsx
<script type="application/ld+json">
  {JSON.stringify(structuredDataObject)}
</script>
```

Our implementation includes the following Schema.org schemas:
- Organization (https://schema.org/Organization)
- WebSite (https://schema.org/WebSite)
- Event (https://schema.org/Event)
- BreadcrumbList (https://schema.org/BreadcrumbList)
- ItemList (https://schema.org/ItemList)

### Environment Variables

The SEO implementation uses the following environment variables:

- `VITE_DOMAIN_URL`: Production domain (default: "https://rvnug.org")
- `VITE_APP_BASE_URL`: Base URL path if not hosted at root (default: "/rvnugorg_rewrite2025")

These are used to generate proper canonical URLs and absolute image paths.

### Image Optimization

For optimal social media sharing:

1. Images should be at least 1200×630 pixels for best display on high-resolution devices
2. Maintain an aspect ratio of 1.91:1
3. Keep file sizes under 1MB
4. Use JPG or PNG format for best compatibility

## Testing SEO Implementation

To test the SEO implementation:

1. **Meta Tag Validation**:
   - Use browser developer tools to inspect the document head
   - Verify all expected meta tags are present

2. **Social Media Previews**:
   - Use Facebook's Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Use Twitter's Card Validator: https://cards-dev.twitter.com/validator

3. **Structured Data Testing**:
   - Use Google's Rich Results Test: https://search.google.com/test/rich-results
   - Use Google's Schema Markup Validator: https://validator.schema.org/
   - Use Google Search Console to monitor structured data performance

## Best Practices for Maintenance

When updating or adding pages:

1. Always include an SEO component with appropriate metadata
2. Add appropriate structured data using the JsonLd component
3. Ensure titles are descriptive and include the RVNUG brand
4. Keep descriptions between 150-160 characters for optimal display in search results
5. Use relevant keywords that accurately represent the content
6. Provide high-quality images for social sharing
7. Test your structured data with Google's Rich Results Test
8. Test social media previews after significant changes

## Future Enhancements

Potential areas for future SEO improvements:

1. Add localized metadata for international visitors
2. Implement more specific Open Graph types for specialized content
3. Implement sitemap generation
4. Add FAQ structured data where appropriate
5. Implement aggregate rating structured data for events and the organization
6. Add Person structured data for team members

## Resources

- [React Helmet Async Documentation](https://github.com/staylor/react-helmet-async)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central Documentation](https://developers.google.com/search/docs)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) 