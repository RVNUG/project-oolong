import { useState, useEffect, useRef } from 'react';

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
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  const handleImageError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageFailed(true);
    // Load fallback image
    const fallbackImage = '/images/generic-member.svg';
    const img = new Image();
    img.onload = handleImageLoad;
    img.src = fallbackImage;
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width, 
        height,
        overflow: 'hidden',
      }}
      className={className}
    >
      {/* Placeholder image */}
      <img
        ref={imgRef}
        src={placeholderSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          position: isLoaded ? 'absolute' : 'relative',
        }}
        width={width}
        height={height}
      />
      
      {/* Actual image - only loads when in viewport */}
      {isIntersecting && (
        <img
          src={imageFailed ? '/images/generic-member.svg' : src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
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