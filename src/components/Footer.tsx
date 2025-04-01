import { Link } from 'react-router-dom';
import '../assets/css/footer.css';
import { Feature, isFeatureEnabled } from '../config/featureFlags';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-social" aria-label="Social media links">
          <a href="https://github.com/rvnug" target="_blank" rel="noopener noreferrer" aria-label="GitHub - Roanoke Valley .NET User Group">
            <i className="fab fa-github" aria-hidden="true"></i>
          </a>
          <a href="https://discord.gg/b4hAu9Pdg5" target="_blank" rel="noopener noreferrer" aria-label="Discord - Join our community">
            <i className="fab fa-discord" aria-hidden="true"></i>
          </a>
          <a href="https://www.meetup.com/roanoke-valley-net-user-group/" target="_blank" rel="noopener noreferrer" aria-label="Meetup - Find our events">
            <i className="fab fa-meetup" aria-hidden="true"></i>
          </a>
          <a href="https://www.youtube.com/@rvnug-roanokevalleydotnetu6781" target="_blank" rel="noopener noreferrer" aria-label="YouTube - Watch our recorded sessions">
            <i className="fab fa-youtube" aria-hidden="true"></i>
          </a>
        </div>
        
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/team">Team</Link>
          {isFeatureEnabled(Feature.COMMUNITY_SHOWCASE) && (
            <Link to="/showcase">Showcase</Link>
          )}
          <Link to="/sponsors">Sponsors</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        
        <div className="footer-copyright">
          <p>&copy; {currentYear} Roanoke Valley .NET User Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 