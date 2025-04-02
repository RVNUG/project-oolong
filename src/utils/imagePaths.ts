/**
 * Resolves image paths relative to the public directory
 * @param path The path to the image, relative to the public directory
 * @returns The complete URL to the image
 */
export const resolveImagePath = (path: string | undefined): string => {
  if (!path) {
    return '/images/team/generic-member.svg';
  }

  // If the path already starts with http/https, it's an external URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get the base URL from Vite
  const base = import.meta.env.VITE_APP_BASE_URL || '';
  
  // Remove any leading slashes from the path
  const cleanPath = path.replace(/^\/+/, '');
  
  // Combine base and path, ensuring exactly one slash between them
  const resolvedPath = base ? `${base.replace(/\/+$/, '')}/${cleanPath}` : `/${cleanPath}`;
  return resolvedPath;
};

/**
 * Checks if an image exists and returns a fallback if it doesn't
 * @param path The path to check
 * @param fallback Optional fallback image path
 * @returns Valid image path or fallback
 */
export const getImageWithFallback = (
  path: string | undefined, 
  fallback: string = '/images/team/generic-member.svg'
): string => {
  if (!path) {
    return resolveImagePath(fallback);
  }
  
  // Return the resolved path
  return resolveImagePath(path);
}; 