/**
 * Resolves image paths relative to the public directory
 * @param path The path to the image, relative to the public directory
 * @returns The complete URL to the image
 */
export const resolveImagePath = (path: string | undefined): string => {
  if (!path) {
    return '/images/generic-member.svg';
  }

  // If the path already starts with http/https, it's an external URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get the base URL from Vite
  const base = import.meta.env.VITE_APP_BASE_URL || '';
  
  // If the path starts with a slash, it's relative to the public directory
  if (path.startsWith('/')) {
    return `${base}${path}`;
  }
  
  // Otherwise, it's relative to the public directory but missing the leading slash
  return `${base}/${path}`;
};

/**
 * Checks if an image exists and returns a fallback if it doesn't
 * @param path The path to check
 * @param fallback Optional fallback image path
 * @returns Valid image path or fallback
 */
export const getImageWithFallback = (
  path: string | undefined, 
  fallback: string = '/images/generic-member.svg'
): string => {
  if (!path) {
    return resolveImagePath(fallback);
  }
  
  // Return the resolved path
  return resolveImagePath(path);
}; 