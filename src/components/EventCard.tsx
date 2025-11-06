import { Link } from 'react-router-dom';
import { MeetupEvent } from '../types';
import { formatTime } from '../utils/dateFormatters';
import EventCalendarButton from './EventCalendarButton';
import { isEventOnline, formatVenueAddress } from '../utils/venueUtils';
import '../assets/css/event-card.css';
import '../assets/css/custom-fixes.css';

interface EventCardProps {
  event: MeetupEvent;
  isHero?: boolean;
  isCompact?: boolean;
}

const EventCard = ({ event, isHero = false, isCompact = false }: EventCardProps) => {
  // Create a date object from local_date and local_time fields, handling potential errors
  let eventDate: Date | null = null;
  try {
    if (event.local_date && event.local_time) {
      eventDate = new Date(`${event.local_date}T${event.local_time}`);
      // Check if date is valid
      if (isNaN(eventDate.getTime())) {
        eventDate = null;
      }
    }
  } catch (error) {
    console.error('Error parsing event date/time:', error);
  }
  
  // Format event description to handle HTML (limiting to a preview)
  const createDescriptionPreview = (html: string) => {
    // Create a temporary element to extract text from HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    
    // Limit to 150 characters
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  // Safely format date components with fallbacks
  const formatDatePart = (date: Date | null, options: Intl.DateTimeFormatOptions) => {
    // Check if date is valid before trying to format it
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'TBD'; // Return a fallback for invalid dates
    }
    return date.toLocaleString('default', options);
  };

  // Safely get date with fallback
  const getDateDay = (date: Date | null) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '--'; // Return a fallback for invalid dates
    }
    return date.getDate().toString();
  };

  // Check if the event is online
  const isOnline = isEventOnline(event);
  
  // Determine if the event is in the past
  const isPast = eventDate ? new Date() > eventDate : false;

  // Safely format time for display
  const displayTime = event.local_time ? formatTime(event.local_time) : 'Time TBD';

  // Get formatted venue info
  const venueAddress = formatVenueAddress(event.venue, isOnline);

  return (
    <div className={`event-card ${isOnline ? 'online-event' : ''} ${isPast ? 'past-event' : ''} ${isHero ? 'event-card-hero' : ''} ${isCompact ? 'event-card-compact' : ''}`}>
      <div className="event-date">
        <div className="event-month">{formatDatePart(eventDate, { month: 'short' })}</div>
        <div className="event-day">{getDateDay(eventDate)}</div>
        <div className="event-year">{formatDatePart(eventDate, { year: 'numeric' })}</div>
      </div>
      
      <div className="event-details">
        {isOnline && <div className="event-badge online-badge">Online</div>}
        {isPast && <div className="event-badge past-badge">Past</div>}
        
        <h3 className="event-title">
          <Link to={`/event/${event.id}`}>{event.name}</Link>
        </h3>
        
        <div className="event-meta">
          <span className="event-time">
            <i className="far fa-clock"></i> {displayTime}
          </span>
          {event.venue && event.venue.name && !isOnline && (
            <span className="event-location">
              <i className="fas fa-map-marker-alt"></i> {event.venue.name}
              {venueAddress && <span className="venue-city">, {venueAddress}</span>}
            </span>
          )}
          {isOnline && (
            <span className="event-location online">
              <i className="fas fa-laptop"></i> Online Event
            </span>
          )}
        </div>
        
        <p className="event-description">
          {event.description ? createDescriptionPreview(event.description) : 'No description available'}
        </p>
        
        <div className="event-actions">
          {!isPast ? (
            <>
              <a href={event.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-calendar-plus"></i> RSVP on Meetup
              </a>
              <EventCalendarButton 
                event={event}
                buttonLabel="Add to Calendar"
                className="btn btn-calendar"
              />
            </>
          ) : (
            <span className="event-completed">Event completed</span>
          )}
          <Link to={`/event/${event.id}`} className="btn btn-secondary">
            <i className="fas fa-info-circle"></i> View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 