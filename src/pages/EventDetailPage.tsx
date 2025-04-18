import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useEvents from '../hooks/useEvents';
import { MeetupEvent } from '../types';
import { formatFullDate, formatTime } from '../utils/dateFormatters';
import { formatVenueAddress, isEventOnline } from '../utils/venueUtils';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import EventCalendarButton from '../components/EventCalendarButton';
import sanitizeHtml from 'sanitize-html';
import { createEventStructuredData, createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import '../assets/css/event-detail.css';
import '../assets/css/custom-fixes.css';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { events, loading, error } = useEvents();
  const [event, setEvent] = useState<MeetupEvent | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!loading && !error && events.length > 0 && id) {
      const foundEvent = events.find(event => event.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        // If event not found, navigate to the events page
        navigate('/events');
      }
    }
  }, [events, loading, error, id, navigate]);

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!event) {
    return <div className="loading">Event not found. Redirecting...</div>;
  }

  // Safely format date and time for displayx
  const formattedDate = event.local_date ? formatFullDate(event.local_date) : 'Date not available';
  const formattedTime = event.local_time ? formatTime(event.local_time) : 'Time not available';
  
  // Create a formatted datetime for structured data and other uses
  let eventDateTime: Date | null = null;
  try {
    if (event.local_date && event.local_time) {
      // Create a date object from the ISO format
      eventDateTime = new Date(`${event.local_date}T${event.local_time}`);
      if (isNaN(eventDateTime.getTime())) {
        console.warn(`Invalid date/time: ${event.local_date}T${event.local_time}`);
        eventDateTime = null;
      }
    }
  } catch (error) {
    console.error("Error parsing event datetime:", error);
    eventDateTime = null;
  }

  // Check if the event is online
  const isOnline = isEventOnline(event);

  // Handle image loading error
  const handleImageError = () => {
    console.warn(`Failed to load event image for: ${event.name}`);
    setImageError(true);
  };

  // Helper function to create a clean description for SEO
  const createEventDescription = (event: MeetupEvent | null) => {
    if (!event) return '';
    
    // Create a base description with event details
    let description = `${event.name} - `;
    
    // Add date and time information
    if (event.local_date && event.local_time) {
      description += `Event on ${new Date(event.local_date).toLocaleDateString()} `;
    }
    
    // Add location information if available
    if (event.venue && event.venue.name) {
      description += `at ${event.venue.name}. `;
    }
    
    // Add a portion of the description if available
    if (event.description) {
      // Strip HTML and limit length
      const textDescription = sanitizeHtml(event.description, {
        allowedTags: [],
        allowedAttributes: {}
      });
      const trimmedDescription = textDescription.length > 150 
        ? textDescription.substring(0, 147) + '...' 
        : textDescription;
      
      description += trimmedDescription;
    } else {
      description += 'Join us for this Roanoke Valley .NET User Group event.';
    }
    
    return description;
  };

  // Create structured data for this event
  const eventStructuredData = createEventStructuredData(event);
  
  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Events', url: `${baseUrl}/events` },
    { name: event.name, url: `${baseUrl}/event/${event.id}` }
  ]);

  // Get the formatted venue address
  const venueAddress = formatVenueAddress(event.venue, isOnline);

  return (
    <div className="event-detail-page">
      <SEO
        title={`${event.name} - RVNUG Event`}
        description={createEventDescription(event)}
        keywords={`event, meetup, .NET, ${event.name}, tech event, Roanoke`}
        ogTitle={event.name}
        ogDescription={createEventDescription(event)}
        ogType="event"
        ogImage="/images/roanoke-star-128-logo.png"
        pathName={location.pathname}
      />
      
      {/* Add structured data */}
      <JsonLd data={eventStructuredData} />
      <JsonLd data={breadcrumbData} />
      
      <div className="event-detail-card">
        <div className="event-detail-title-section">
          <button className="back-button" onClick={() => navigate('/events')}>
            <i className="fas fa-arrow-left"></i> Back to Events
          </button>
          
          <h1>{event.name}</h1>
          
          <div className="event-time-location">
            <div className="event-datetime">
              <i className="far fa-calendar-alt"></i> {formattedDate}
              <span className="divider">|</span>
              <i className="far fa-clock"></i> {formattedTime}
            </div>
            
            <div className="event-venue">
              <i className={isOnline ? 'fas fa-video' : 'fas fa-map-marker-alt'}></i>
              {isOnline ? 'Online Event' : (event.venue ? event.venue.name : 'Location TBD')}
              {venueAddress && !isOnline && (
                <div className="venue-address">{venueAddress}</div>
              )}
            </div>
          </div>
          
          {isOnline ? (
            <div className="event-status">
              <i className="fas fa-wifi"></i> Online Event
            </div>
          ) : null}
        </div>
        
        <div className="event-detail-content">
          {event.featured_photo && !imageError ? (
            <div className="event-featured-image">
              <img 
                src={event.featured_photo.photo_link} 
                alt={`${event.name} featured image`}
                onError={handleImageError} 
              />
            </div>
          ) : (
            <div className="event-image-fallback">
              <div className="event-image-fallback-icon">
                <i className="fas fa-calendar-alt" aria-hidden="true"></i>
              </div>
              <span>{event.name}</span>
            </div>
          )}
          
          <div className="event-description" dangerouslySetInnerHTML={{ __html: event.description }} />
          
          <div className="event-detail-actions">
            <a 
              href={event.link} 
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-external-link-alt"></i> RSVP on Meetup
            </a>
            
            <EventCalendarButton 
              event={event} 
              buttonLabel="Add to Calendar" 
              className="btn btn-calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 