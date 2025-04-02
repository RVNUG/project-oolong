import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import '../assets/css/community-showcase.css';
import ProjectCard from '../components/ProjectCard';
import useProjects from '../hooks/useProjects';
import logo from '../assets/images/roanoke-star-128-logo.png';

const CommunityShowcasePage = () => {
  const { loading, error, projects } = useProjects();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation();

  // Filter projects by category and search term
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get unique categories for the filter
  const categories = ['all', ...new Set(projects.map(project => project.category))];

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Community Showcase', url: `${baseUrl}/showcase` }
  ]);

  return (
    <div className="community-showcase-page">
      <SEO
        title="Community Showcase - Roanoke Valley .NET User Group (RVNUG)"
        description="Explore projects, achievements, and contributions from members of the Roanoke Valley .NET User Group community. See what our talented developers are building with .NET and related technologies."
        keywords="showcase, projects, community projects, .NET projects, developer showcase, portfolio, community achievements"
        pathName={location.pathname}
      />
      
      {/* Add structured data */}
      <JsonLd data={breadcrumbData} />
      
      <section className="hero">
        <img src={logo} alt="" className="hero-logo" aria-hidden="true" />
        <div className="hero-content">
          <h1>Community Showcase</h1>
          <p>Highlighting projects and achievements from our community members</p>
        </div>
      </section>

      <section className="showcase-content">
        <div className="showcase-intro">
          <h2>Featured Projects</h2>
          <p>
            The RVNUG Community Showcase highlights exceptional projects developed by our members. 
            These projects demonstrate the creativity, technical skills, and innovation within our community.
          </p>
          <p>
            Each project featured here has been reviewed and approved by the RVNUG team for quality and relevance 
            to the .NET ecosystem.
          </p>
        </div>

        <div className="showcase-filters">
          <div className="category-filter">
            <label htmlFor="category-select">Filter by category:</label>
            <select 
              id="category-select" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-filter">
            <label htmlFor="search-input">Search projects:</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search by title, description or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </section>

      <section className="submit-project">
        <h2>Submit Your Project</h2>
        <p>
          Are you a member of the RVNUG community with a project you'd like to showcase?
          We're always looking for interesting projects to feature!
        </p>
        <div className="submission-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Check Eligibility</h3>
            <p>Your project should be related to .NET technologies or be of interest to our community.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Prepare Materials</h3>
            <p>Have your code repository, documentation, and screenshots ready.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Submit for Review</h3>
            <p>Fill out our submission form with your project details for review by our team.</p>
          </div>
        </div>
        <a href="mailto:info@rvnug.org?subject=Project%20Showcase%20Submission" className="btn btn-primary">Submit Your Project</a>
      </section>
    </div>
  );
};

export default CommunityShowcasePage; 