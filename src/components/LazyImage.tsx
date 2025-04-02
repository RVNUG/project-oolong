import { useState, useEffect, useRef } from 'react';
import '../assets/css/LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  placeholderSrc?: string;
}

const LazyImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWUzZDkiLz48L3N2Zz4=',
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading images when they're 200px from viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  const handleImageError = () => {
    console.error('Failed to load image:', {
      src,
      absolutePath: new URL(src, window.location.href).href,
      currentLocation: window.location.href
    });
    setImageFailed(true);
    // Load fallback image
    const fallbackImage = '/images/team/generic-member.svg';
    const img = new Image();
    img.onload = handleImageLoad;
    img.src = fallbackImage;
  };

  // Convert width and height to CSS variables
  const containerStyle = {
    '--lazy-image-width': typeof width === 'number' ? `${width}px` : width,
    '--lazy-image-height': typeof height === 'number' ? `${height}px` : height,
  } as React.CSSProperties;

  return (
    <div 
      className={`lazy-image-container ${className}`}
      style={containerStyle}
    >
      {/* Placeholder image */}
      <img
        ref={imgRef}
        src={placeholderSrc}
        alt={alt}
        className={`lazy-image-placeholder ${isLoaded ? 'lazy-image-placeholder--hidden' : 'lazy-image-placeholder--visible'}`}
        width={width}
        height={height}
      />
      
      {/* Actual image - only loads when in viewport */}
      {isIntersecting && (
        <img
          src={imageFailed ? '/images/team/generic-member.svg' : src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'lazy-image--loaded' : 'lazy-image--loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage; 