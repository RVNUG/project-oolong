import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/navbar.css';
import logo from '../assets/images/roanoke-star-128-logo.png';
import ThemeToggle from './ThemeToggle';
import { Feature, isFeatureEnabled } from '../config/featureFlags';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen &&
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="RVNUG Logo" className="logo-image" />
            <span className="logo-text">RVNUG</span>
          </Link>
          
          <div className="navbar-actions">
            <ThemeToggle />
            
            {isOpen ? (
              <button 
                ref={buttonRef}
                className="menu-icon" 
                onClick={toggleMenu}
                aria-expanded="true"
                aria-controls="nav-menu"
                aria-label="Close menu"
              >
                <i className="fas fa-times"></i>
              </button>
            ) : (
              <button 
                ref={buttonRef}
                className="menu-icon" 
                onClick={toggleMenu}
                aria-expanded="false"
                aria-controls="nav-menu"
                aria-label="Open menu"
              >
                <i className="fas fa-bars"></i>
              </button>
            )}
          </div>
          
          <ul 
            id="nav-menu" 
            ref={menuRef}
            className={isOpen ? 'nav-menu active' : 'nav-menu'} 
          >
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/events" className="nav-link">
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/team" className="nav-link">
                Team
              </Link>
            </li>
            {isFeatureEnabled(Feature.COMMUNITY_SHOWCASE) && (
              <li className="nav-item">
                <Link to="/showcase" className="nav-link">
                  Showcase
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/sponsors" className="nav-link">
                Sponsors
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar; 