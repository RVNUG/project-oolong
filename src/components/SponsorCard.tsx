import { Sponsor } from '../types';
import '../assets/css/sponsor-card.css';
import { getResourceUrl } from '../utils/config';
import { useState } from 'react';

interface SponsorCardProps {
  sponsor: Sponsor;
  size?: 'normal' | 'large';
}

const SponsorCard = ({ sponsor, size = 'normal' }: SponsorCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Use getResourceUrl to handle the base path correctly
  const getImagePath = () => {
    return getResourceUrl(`images/sponsors/${sponsor.logo}`);
  };

  // Fallback for image loading errors
  const handleImageError = () => {
    console.warn(`Failed to load sponsor logo: ${sponsor.logo}`);
    setImageError(true);
  };

  return (
    <div className={`sponsor-card sponsor-${sponsor.level.toLowerCase()} size-${size}`}>
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
        <span className="sponsor-level">{sponsor.level} Sponsor</span>
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