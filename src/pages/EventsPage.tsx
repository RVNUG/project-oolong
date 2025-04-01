import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useEvents from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createEventListStructuredData, createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import '../assets/css/events.css';
import { FaCalendarAlt, FaHistory, FaMeetup } from 'react-icons/fa';

const EventsPage = () => {
  const location = useLocation();
  const { loading, error, upcomingEvents, pastEvents } = useEvents();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Events', url: `${baseUrl}/events` }
  ]);

  // Create event list structured data using the active tab's events
  const eventsData = activeTab === 'upcoming' 
    ? createEventListStructuredData(upcomingEvents)
    : createEventListStructuredData(pastEvents);

  return (
    <div className="events-page">
      <SEO
        title="Events - Roanoke Valley .NET User Group (RVNUG)"
        description="Discover upcoming and past events from the Roanoke Valley .NET User Group. Join us for presentations, workshops, and networking opportunities in the Roanoke tech community."
        keywords="events, meetup, .NET events, tech events, developer meetup, Roanoke events, presentations, workshops"
        pathName={location.pathname}
      />
      
      <JsonLd data={breadcrumbData} />
      <JsonLd data={eventsData} />
      
      <div className="page-header">
        <h1>Our <span className="highlight">Events</span></h1>
        <p>Join us for our upcoming events or check out what you might have missed!</p>
      </div>

      <div className="events-tabs">
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <FaCalendarAlt className="tab-icon" /> Upcoming Events
          </button>
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <FaHistory className="tab-icon" /> Past Events
          </button>
        </div>
      </div>

      <div className="events-container">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : activeTab === 'upcoming' ? (
          upcomingEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-content">
                <h3>No upcoming events scheduled</h3>
                <p>Please check back soon for new events, or join our Meetup group to be notified when we schedule our next meeting.</p>
                <div className="events-actions">
                  <a 
                    href="https://www.meetup.com/roanoke-valley-net-user-group/" 
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaMeetup className="btn-icon" /> Join on Meetup
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )
        ) : (
          pastEvents.length === 0 ? (
            <div className="no-events">
              <div className="no-events-content">
                <h3>No past events found</h3>
                <p>We're just getting started! Check back later for a history of our events.</p>
              </div>
            </div>
          ) : (
            <div className="events-grid">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )
        )}
      </div>
      
      <div className="events-info-section">
        <div className="info-card">
          <h3>About Our Events</h3>
          <p>
            RVNUG hosts regular meetups featuring presentations on .NET, cloud technologies, web development, 
            and other topics of interest to the developer community. Our events are free and open to all.
          </p>
        </div>
        <div className="info-card">
          <h3>Want to Present?</h3>
          <p>
            Have knowledge to share? We're always looking for speakers! Whether you're a seasoned presenter 
            or it's your first time, we'd love to have you share your expertise with our community.
          </p>
          <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 