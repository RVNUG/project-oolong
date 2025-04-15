import React, { useState, useRef, useEffect } from 'react';
import { MeetupEvent } from '../types';
import '../assets/css/event-calendar-button.css';

interface EventCalendarButtonProps {
  event: MeetupEvent;
  buttonLabel?: string;
  className?: string;
}

/**
 * EventCalendarButton - Custom calendar integration button
 * 
 * This component creates a dropdown menu with options to add events to
 * different calendar services (Google, Apple, Outlook, Yahoo, etc.)
 */
const EventCalendarButton = ({ 
  event, 
  buttonLabel = 'Add to Calendar',
  className = '' 
}: EventCalendarButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isOpen ||
        (dropdownRef.current && 
        dropdownRef.current.contains(event.target as Node)) ||
        (buttonRef.current && 
        buttonRef.current.contains(event.target as Node))
      ) {
        return; // Early return if dropdown is closed or click is inside
      }
      
      setIsOpen(false);
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Ensure we have valid dates
  if (!event.local_date || !event.local_time) {
    return null;
  }

  // Create date objects for start and end times
  const startDateTime = new Date(`${event.local_date}T${event.local_time}`);
  
  // Determine end time based on common event patterns
  let endDateTime: Date;

  if (event.duration) {
    // If we have an explicit duration in milliseconds, use it
    endDateTime = new Date(startDateTime.getTime() + event.duration);
  } else {
    // Otherwise infer a reasonable duration based on the event type/time
    const eventName = event.name.toLowerCase();
    const startHour = startDateTime.getHours();
    
    if (eventName.includes('code and coffee') || 
        (startHour >= 8 && startHour <= 11)) {
      // Morning events typically run 3 hours (Code and Coffee events)
      endDateTime = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000);
    } else if (eventName.includes('social') || 
              eventName.includes('mixer') || 
              eventName.includes('networking')) {
      // Social events typically run 2 hours
      endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
    } else if (startHour >= 17 && startHour <= 19) {
      // Evening events (typically evening talks) run 1.5 hours
      endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
    } else {
      // Default to a 2-hour event for everything else
      endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
    }
  }
  
  // Clean description by removing HTML tags
  const cleanDescription = event.description
    ? event.description.replace(/<[^>]*>?/gm, '')
    : 'Join us for this Roanoke Valley .NET User Group event.';
  
  // Format times for calendar services
  const dateStart = startDateTime.toISOString().replace(/-|:|\.\d+/g, '');
  const dateEnd = endDateTime.toISOString().replace(/-|:|\.\d+/g, '');
  
  // Determine the location string
  let locationStr = 'Online Event';
  if (event.venue && !event.is_online) {
    locationStr = `${event.venue.name}${event.venue.address_1 ? ', ' + event.venue.address_1 : ''}${event.venue.city ? ', ' + event.venue.city : ''}${event.venue.state ? ', ' + event.venue.state : ''}`;
  }

  // Toggle dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen);
  };

  // Generate Google Calendar URL with Eastern timezone
  const getGoogleCalendarUrl = () => {
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const details = encodeURIComponent(cleanDescription);
    const location = encodeURIComponent(locationStr);
    const text = encodeURIComponent(event.name);
    const dates = `${dateStart}/${dateEnd}`;
    
    return `${baseUrl}?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&ctz=America/New_York&sprop=website:rvnug.org`;
  };

  // Generate Yahoo Calendar URL
  const getYahooCalendarUrl = () => {
    const baseUrl = 'https://calendar.yahoo.com/';
    const title = encodeURIComponent(event.name);
    const desc = encodeURIComponent(cleanDescription);
    const loc = encodeURIComponent(locationStr);
    const st = dateStart;
    const et = dateEnd;
    
    return `${baseUrl}?v=60&title=${title}&st=${st}&et=${et}&desc=${desc}&in_loc=${loc}`;
  };

  // Generate Outlook Web URL
  const getOutlookCalendarUrl = () => {
    const baseUrl = 'https://outlook.live.com/calendar/0/action/compose';
    const subject = encodeURIComponent(event.name);
    const body = encodeURIComponent(cleanDescription);
    const location = encodeURIComponent(locationStr);
    // Outlook uses a different date format
    const startTime = startDateTime.toISOString();
    const endTime = endDateTime.toISOString();
    
    return `${baseUrl}?subject=${subject}&body=${body}&location=${location}&startdt=${startTime}&enddt=${endTime}`;
  };

  // Generate iCal file content with Eastern timezone
  const getICalFileContent = () => {
    // Format dates for iCal
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const now = new Date();
    const calStart = formatDate(startDateTime);
    const calEnd = formatDate(endDateTime);
    const createdNow = formatDate(now);
    
    // Create unique identifier for the event
    const uid = `event-${event.id}@rvnug.org`;
    
    // Build iCal file content with explicit timezone
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RVNUG//Event Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
SUMMARY:${event.name}
DTSTAMP:${createdNow}
DTSTART:${calStart}
DTEND:${calEnd}
DESCRIPTION:${cleanDescription.replace(/\n/g, '\\n')}
LOCATION:${locationStr}
STATUS:CONFIRMED
SEQUENCE:0
TZID:America/New_York
END:VEVENT
END:VCALENDAR`;
  };

  // Calendar option handlers
  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getGoogleCalendarUrl(), '_blank');
    setIsOpen(false);
  };
  
  const handleOutlookCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getOutlookCalendarUrl(), '_blank');
    setIsOpen(false);
  };
  
  const handleYahooCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getYahooCalendarUrl(), '_blank');
    setIsOpen(false);
  };

  // Download iCal file
  const downloadICalFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileName = `${event.name.replace(/\s+/g, '_')}.ics`;
    const fileContent = getICalFileContent();
    const blob = new Blob([fileContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsOpen(false);
  };

  // Handle Apple/iCal (just downloads .ics file)
  const handleAppleCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadICalFile(e);
  };

  return (
    <div className="custom-calendar-dropdown">
      <button 
        ref={buttonRef}
        className={className} 
        onClick={toggleDropdown}
        aria-haspopup="true" 
        aria-expanded="false"
        aria-label="Add to Calendar"
      >
        <i className="far fa-calendar-plus" aria-hidden="true"></i> {buttonLabel}
      </button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="calendar-dropdown-menu"
          onClick={e => e.stopPropagation()}
          role="menu"
          aria-orientation="vertical"
        >
          <button 
            className="calendar-option google" 
            onClick={handleGoogleCalendar}
            role="menuitem"
          >
            <i className="fab fa-google" aria-hidden="true"></i> Google Calendar
          </button>
          
          <button 
            className="calendar-option apple" 
            onClick={handleAppleCalendar}
            role="menuitem"
          >
            <i className="fab fa-apple" aria-hidden="true"></i> Apple Calendar
          </button>
          
          <button 
            className="calendar-option outlook" 
            onClick={handleOutlookCalendar}
            role="menuitem"
          >
            <i className="far fa-envelope" aria-hidden="true"></i> Outlook
          </button>
          
          <button 
            className="calendar-option yahoo" 
            onClick={handleYahooCalendar}
            role="menuitem"
          >
            <i className="fab fa-yahoo" aria-hidden="true"></i> Yahoo
          </button>
          
          <button 
            className="calendar-option ics" 
            onClick={downloadICalFile}
            role="menuitem"
          >
            <i className="far fa-calendar-alt" aria-hidden="true"></i> Download .ics
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCalendarButton; 