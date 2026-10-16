import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import JsonLd from '../JsonLd';
import SEO from '../SEO';

describe('SEO', () => {
  it('renders page-specific canonical, social, and search metadata', async () => {
    render(
      <HelmetProvider>
        <SEO
          title="Events"
          description="Upcoming community events"
          keywords="events, community"
          pathName="events"
          ogTitle="RVNUG events"
          twitterCard="summary"
          twitterImage="/images/event.png"
          robots="noindex"
        />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toBe('Events');
      expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Upcoming community events');
      expect(document.head.querySelector('meta[name="keywords"]')).toHaveAttribute('content', 'events, community');
      expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://rvnug.org/events');
      expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'RVNUG events');
      expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute('content', 'https://rvnug.org/events');
      expect(document.head.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
      expect(document.head.querySelector('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://rvnug.org/images/event.png');
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    });
  });

  it('uses default metadata and falls back from social titles and descriptions', async () => {
    render(<HelmetProvider><SEO /></HelmetProvider>);
    await waitFor(() => {
      expect(document.title).toContain('Roanoke Valley .NET User Group');
      expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(document.title);
      expect(document.head.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(document.title);
      expect(document.head.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe(
        document.head.querySelector('meta[name="description"]')?.getAttribute('content')
      );
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    });
  });
});

describe('JsonLd', () => {
  it('serializes structured data into an application/ld+json script', async () => {
    const structuredData = { '@context': 'https://schema.org', '@type': 'Event', name: 'Community meetup' };
    render(<HelmetProvider><JsonLd data={structuredData} /></HelmetProvider>);

    await waitFor(() => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      expect(script?.textContent).toBe(JSON.stringify(structuredData));
    });
  });
});