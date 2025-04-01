import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import '../assets/css/not-found.css';

const NotFoundPage = () => {
  const location = useLocation();
  
  return (
    <div className="not-found-page">
      <SEO
        title="Page Not Found - Roanoke Valley .NET User Group (RVNUG)"
        description="The page you're looking for doesn't exist or has been moved."
        pathName={location.pathname}
        // Set noindex for 404 pages
        robots="noindex, nofollow"
      />
      
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 