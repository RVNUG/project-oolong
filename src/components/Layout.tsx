import { Suspense, type ReactNode } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import JsonLd from './JsonLd';
import { createOrganizationStructuredData, createWebsiteStructuredData } from '../utils/structuredData';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Create structured data for organization and website
  const organizationData = createOrganizationStructuredData();
  const websiteData = createWebsiteStructuredData();

  return (
    <div className="app">
      {/* Add global structured data */}
      <JsonLd data={organizationData} />
      <JsonLd data={websiteData} />
      
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <NavBar />
      <main id="main-content" className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
} 