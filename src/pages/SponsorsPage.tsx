import { useLocation, Link } from 'react-router-dom';
import useSponsors from '../hooks/useSponsors';
import SponsorCard from '../components/SponsorCard';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import '../assets/css/sponsors.css';
import { Sponsor } from '../types';
import { FaHandshake, FaBuilding, FaRocket, FaChartLine } from 'react-icons/fa';

const SponsorsPage = () => {
  const location = useLocation();
  const { sponsors, loading, error } = useSponsors();

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Sponsors', url: `${baseUrl}/sponsors` }
  ]);

  return (
    <div className="sponsors-page">
      <SEO
        title="Our Sponsors - Roanoke Valley .NET User Group (RVNUG)"
        description="Meet the sponsors who support the Roanoke Valley .NET User Group. These organizations help make our events, workshops, and community initiatives possible."
        keywords="sponsors, supporters, tech sponsors, community supporters, Roanoke businesses, tech companies"
        pathName={location.pathname}
      />
      
      <JsonLd data={breadcrumbData} />
      
      <div className="page-header">
        <h1>Our <span className="highlight">Sponsors</span></h1>
        <p>The amazing organizations that make our community possible through their generous support</p>
      </div>

      <div className="sponsors-content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading sponsors...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="no-sponsors">
            <div className="no-sponsors-content">
              <h3>No sponsors found</h3>
              <p>We're currently looking for sponsors to support our community!</p>
              <p>If you're interested in becoming a sponsor, please <Link to="/contact">contact us</Link>.</p>
            </div>
          </div>
        ) : (
          <div className="sponsors-container">
            <div className="sponsors-grid">
              {sponsors.map((sponsor: Sponsor) => (
                <SponsorCard 
                  key={sponsor.id} 
                  sponsor={sponsor} 
                  size="normal"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sponsorship-benefits-section">
        <h2 className="section-title">Sponsorship Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <FaHandshake />
            </div>
            <h3>Community Connection</h3>
            <p>Connect with local developers and tech professionals who could become your next clients or employees.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <FaBuilding />
            </div>
            <h3>Brand Visibility</h3>
            <p>Gain visibility in the local tech community with your logo featured on our website and at events.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <FaRocket />
            </div>
            <h3>Event Access</h3>
            <p>Get special access to our events, workshops, and networking opportunities for your team.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <FaChartLine />
            </div>
            <h3>Community Impact</h3>
            <p>Make a positive impact on the local tech ecosystem by supporting educational initiatives.</p>
          </div>
        </div>
      </div>

      <div className="become-sponsor-section">
        <div className="become-sponsor-content">
          <h2>Interested in becoming a sponsor?</h2>
          <p>Support the local tech community and gain visibility for your organization.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us About Sponsorship</Link>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage; 