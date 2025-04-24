import { Sponsor } from '../types';
import '../assets/css/sponsor-card.css';
import { getResourceUrl } from '../utils/config';
import { useState, useEffect } from 'react';

interface SponsorCardProps {
  sponsor: Sponsor;
  size?: 'normal' | 'large';
}

const SponsorCard = ({ sponsor, size = 'normal' }: SponsorCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set up responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use getResourceUrl to handle the base path correctly
  const getImagePath = () => {
    // If the image filename contains MD.png (medium) and we're on mobile, 
    // replace with SM_320px.png (small) version
    let logoPath = sponsor.logo;
    
    if (isMobile && sponsor.logo.includes('_MD.png')) {
      logoPath = sponsor.logo.replace('_MD.png', '_SM_320px.png');
    }
    
    return getResourceUrl(`images/sponsors/${logoPath}`);
  };

  // Fallback for image loading errors
  const handleImageError = () => {
    console.warn(`Failed to load sponsor logo: ${sponsor.logo}`);
    setImageError(true);
  };

  return (
    <div className={`sponsor-card size-${size}`}>
      <div className="sponsor-logo-container">
        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" aria-label={`${sponsor.name} website`}>
          {imageError ? (
            <div className="sponsor-logo-fallback">
              {sponsor.name.charAt(0)}
            </div>
          ) : (
            <img 
              src={getImagePath()} 
              alt={`${sponsor.name} logo`} 
              className="sponsor-logo" 
              onError={handleImageError}
            />
          )}
        </a>
      </div>
      
      <div className="sponsor-content">
        <h3 className="sponsor-name">{sponsor.name}</h3>
        <p className="sponsor-description" style={{ textTransform: 'none' }}>{sponsor.description}</p>
        <a 
          href={sponsor.website} 
          className="sponsor-link" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`Visit ${sponsor.name} website`}
        >
          Visit Website <i className="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  );
};

export default SponsorCard; 