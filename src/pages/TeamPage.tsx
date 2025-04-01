import { useLocation, Link } from 'react-router-dom';
import useTeam from '../hooks/useTeam';
import TeamMemberCard from '../components/TeamMemberCard';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import '../assets/css/team.css';
import { FaUsers, FaHandsHelping } from 'react-icons/fa';

const TeamPage = () => {
  const location = useLocation();
  const { teamMembers, loading, error } = useTeam();

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Our Team', url: `${baseUrl}/team` }
  ]);

  return (
    <div className="team-page">
      <SEO
        title="Our Team - Roanoke Valley .NET User Group (RVNUG)"
        description="Meet the dedicated team behind the Roanoke Valley .NET User Group. Our volunteers organize events, manage the community, and work to promote technology in the Roanoke area."
        keywords="team, volunteers, organizers, .NET community, leadership, tech community"
        pathName={location.pathname}
      />
      
      {/* Add structured data */}
      <JsonLd data={breadcrumbData} />
    
      <div className="page-header">
        <h1>Our <span className="highlight">Team</span></h1>
        <p>Meet the amazing people who make RVNUG possible. Our dedicated volunteers organize events, create content, and build our community.</p>
      </div>

      <div className="team-content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading team members...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="no-team">
            <div className="no-team-content">
              <h3>No team members found</h3>
              <p>We're currently updating our team information. Check back soon!</p>
            </div>
          </div>
        ) : (
          <div className="team-grid">
            {teamMembers.map(member => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      <div className="team-values-section">
        <h2 className="section-title">Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <FaUsers />
            </div>
            <h3>Community First</h3>
            <p>We build and nurture an inclusive community where developers of all skill levels can learn, connect, and collaborate.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaHandsHelping />
            </div>
            <h3>Knowledge Sharing</h3>
            <p>We believe in the power of sharing knowledge, experiences, and best practices to help everyone grow professionally.</p>
          </div>
        </div>
      </div>

      <div className="join-team-section">
        <div className="join-team-content">
          <h2>Interested in joining our team?</h2>
          <p>
            We're always looking for passionate people to help organize events, develop content, 
            and grow our community. If you're interested in getting involved, please reach out!
          </p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default TeamPage; 