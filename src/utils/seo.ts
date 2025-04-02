/**
 * Utility functions for SEO
 */

// Get base URL from environment or default
const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || '';
  const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'https://rvnug.org';
  
  // Ensure domainUrl doesn't end with slash if baseUrl starts with one
  const formattedDomainUrl = domainUrl.endsWith('/') ? domainUrl.slice(0, -1) : domainUrl;
  
  return `${formattedDomainUrl}${baseUrl}`;
};

/**
 * Gets the canonical URL for a specific path
 * @param path - The relative path (e.g., '/events', '/team')
 * @returns The full canonical URL
 */
export const getCanonicalUrl = (path: string = ''): string => {
  const baseUrl = getBaseUrl();
  
  // Ensure path starts with a slash if it's not empty and not already starting with one
  const formattedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  
  return `${baseUrl}${formattedPath}`;
};

/**
 * Gets the absolute URL for an image
 * @param relativePath - The relative path to the image from the public folder
 * @returns The full image URL
 */
export const getImageUrl = (relativePath: string): string => {
  const baseUrl = getBaseUrl();
  
  // Remove leading slash if present in relativePath
  const formattedPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  return `${baseUrl}/${formattedPath}`;
}; 