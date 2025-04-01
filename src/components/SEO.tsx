import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getImageUrl } from '../utils/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  pathName?: string;
  robots?: string;
}

const SEO = ({
  title = 'Roanoke Valley .NET User Group (RVNUG)',
  description = 'The Roanoke Valley .NET User Group (RVNUG) is a community of developers passionate about .NET technologies in the Roanoke Valley area.',
  keywords = '.NET, C#, software development, programming, Roanoke, user group, technology, developers',
  ogTitle,
  ogDescription,
  ogImage = '/images/roanoke-star-128-logo.png',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  pathName = '',
  robots = 'index, follow',
}: SEOProps) => {
  // Use provided values or fallbacks
  const metaOgTitle = ogTitle || title;
  const metaOgDescription = ogDescription || description;
  const metaTwitterTitle = twitterTitle || metaOgTitle;
  const metaTwitterDescription = twitterDescription || metaOgDescription;
  
  // Generate URLs
  const pageCanonicalUrl = canonicalUrl || getCanonicalUrl(pathName);
  const pageOgUrl = ogUrl || pageCanonicalUrl;
  const pageOgImage = getImageUrl(ogImage);
  const pageTwitterImage = twitterImage ? getImageUrl(twitterImage) : pageOgImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={pageCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:url" content={pageOgUrl} />
      <meta property="og:site_name" content="Roanoke Valley .NET User Group" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={metaTwitterTitle} />
      <meta name="twitter:description" content={metaTwitterDescription} />
      <meta name="twitter:image" content={pageTwitterImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content={robots} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Roanoke Valley .NET User Group" />
    </Helmet>
  );
};

export default SEO; 