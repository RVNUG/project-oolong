/**
 * Configuration utilities for the application
 */

/**
 * Get the base URL from environment variables
 * This handles the correct path prefix when deployed to different environments
 * @returns The base URL for the application
 */
export const getBaseUrl = (): string => {
  return import.meta.env.VITE_APP_BASE_URL || '/';
};

/**
 * Get the full URL for a resource
 * @param path The path to the resource, relative to the base URL
 * @returns The full URL for the resource
 */
export const getResourceUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Remove trailing slash from base URL if present
  const baseUrlClean = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Remove leading slash from path if present
  const pathClean = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrlClean}/${pathClean}`;
}; 