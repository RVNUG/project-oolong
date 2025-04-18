/**
 * RVNUG Website JavaScript
 * Handles interactivity and dynamic content loading
 */

import DOMPurify from 'dompurify';

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  setupMobileMenu();
  
  // Dynamic content loading
  loadEventsFromMeetupJSONP(); // Use JSONP approach for GitHub Pages compatibility
  loadTeamMembers();
  loadSponsors();
  
  // Form submissions
  setupFormHandlers();
  
  // Smooth scrolling for anchor links
  setupSmoothScrolling();
});

/**
 * Mobile menu functionality
 */
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      
      // Accessibility: Set aria-expanded attribute
      const isExpanded = navLinks.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = mobileMenuToggle.contains(event.target) || navLinks.contains(event.target);
      
      if (!isClickInside && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', false);
      }
    });
  }
}

/**
 * Load events from Meetup API using JSONP (GitHub Pages compatible)
 * This function is used in the DOMContentLoaded event listener
 */
function loadEventsFromMeetupJSONP() {
  const eventsList = document.querySelector('.events-list');
  const nextEventSection = document.querySelector('#next-event .event-card');
  
  if (eventsList || nextEventSection) {
    // Meetup group URL name
    const groupUrlName = 'roanoke-valley-net-user-group';
    
    // Create a script element for JSONP request
    const script = document.createElement('script');
    script.src = `https://api.meetup.com/${groupUrlName}/events?&sign=true&photo-host=public&page=10&status=upcoming,past&callback=handleMeetupEvents`;
    document.body.appendChild(script);
    
    // Listen for the data ready event
    document.addEventListener('meetupDataReady', function onMeetupDataReady() {
      // Remove the listener to avoid duplicates
      document.removeEventListener('meetupDataReady', onMeetupDataReady);
      
      // Process the data
      const events = window.meetupEventsData;
      
      // Clean up
      document.body.removeChild(script);
      
      // Sort events by date (most recent first for past events, earliest first for upcoming)
      events.sort((a, b) => new Date(a.time) - new Date(b.time));
      
      // Split into upcoming and past events
      const now = new Date();
      const upcomingEvents = events.filter(event => new Date(event.time) > now);
      const pastEvents = events.filter(event => new Date(event.time) <= now)
        .sort((a, b) => new Date(b.time) - new Date(a.time)); // Reverse sort for past events
      
      // Display next upcoming event in the hero section
      if (nextEventSection && upcomingEvents.length > 0) {
        const nextEvent = upcomingEvents[0];
        updateNextEventSection(nextEvent);
      }
      
      // Display all events in the events list
      if (eventsList) {
        // Clear existing content
        eventsList.innerHTML = '';
        
        // Add upcoming events with "Upcoming" label
        if (upcomingEvents.length > 0) {
          const upcomingLabel = document.createElement('h3');
          upcomingLabel.textContent = 'Upcoming Events';
          upcomingLabel.className = 'events-section-label';
          eventsList.appendChild(upcomingLabel);
          
          upcomingEvents.forEach(event => {
            const eventHtml = createEventCard(event);
            eventsList.innerHTML += eventHtml;
          });
        }
        
        // Add past events with "Past Events" label (limit to 5)
        if (pastEvents.length > 0) {
          const pastLabel = document.createElement('h3');
          pastLabel.textContent = 'Past Events';
          pastLabel.className = 'events-section-label';
          eventsList.appendChild(pastLabel);
          
          pastEvents.slice(0, 5).forEach(event => {
            const eventHtml = createEventCard(event, true);
            eventsList.insertAdjacentHTML('beforeend', eventHtml);
          });
        }
        
        // If no events found
        if (upcomingEvents.length === 0 && pastEvents.length === 0) {
          eventsList.innerHTML = '<p>No events found. Please check back later.</p>';
        }
      }
    });
    
    // Add error handling with a timeout
    const timeout = setTimeout(() => {
      console.error('Meetup API request timed out');
      loadEventsFromLocalData();
      if (eventsList) {
        eventsList.innerHTML = '<p>Unable to load events from Meetup. Showing cached events instead.</p>' + eventsList.innerHTML;
      }
    }, 10000); // 10 second timeout
    
    // Clear the timeout when data is received
    document.addEventListener('meetupDataReady', function clearMeetupTimeout() {
      document.removeEventListener('meetupDataReady', clearMeetupTimeout);
      clearTimeout(timeout);
    });
  }
}

/**
 * Fallback: Load events from local JSON file if Meetup API fails
 */
function loadEventsFromLocalData() {
  const eventsList = document.querySelector('.events-list');
  const nextEventSection = document.querySelector('#next-event .event-card');
  
  if (eventsList || nextEventSection) {
    fetch('src/data/events.json')
      .then(response => response.json())
      .then(events => {
        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Display next upcoming event
        if (nextEventSection && events.length > 0) {
          const nextEvent = events[0];
          const eventDate = new Date(nextEvent.date);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          nextEventSection.querySelector('.month').textContent = monthNames[eventDate.getMonth()];
          nextEventSection.querySelector('.day').textContent = eventDate.getDate();
          nextEventSection.querySelector('.year').textContent = eventDate.getFullYear();
          nextEventSection.querySelector('h3').textContent = nextEvent.title;
          nextEventSection.querySelector('.event-meta span:first-child').innerHTML = 
            `<i class="fa-solid fa-clock"></i> ${nextEvent.time}`;
          nextEventSection.querySelector('.event-meta span:last-child').innerHTML = 
            `<i class="fa-solid fa-location-dot"></i> ${nextEvent.location}`;
          nextEventSection.querySelector('.event-description').textContent = nextEvent.description;
        }
        
        // Display all events
        if (eventsList) {
          events.forEach(event => {
            const eventDate = new Date(event.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            const eventHtml = `
              <div class="event-card">
                <div class="event-date">
                  <span class="month">${monthNames[eventDate.getMonth()]}</span>
                  <span class="day">${eventDate.getDate()}</span>
                  <span class="year">${eventDate.getFullYear()}</span>
                </div>
                <div class="event-details">
                  <h3>${event.title}</h3>
                  <p class="event-meta">
                    <span><i class="fa-solid fa-clock"></i> ${event.time}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                  </p>
                  <p class="event-description">${event.description}</p>
                  <div class="event-actions">
                    <a href="${event.rsvpLink}" class="primary-button">RSVP Now</a>
                    <a href="${event.calendarLink}" class="secondary-button">Add to Calendar</a>
                  </div>
                </div>
              </div>
            `;
            
            eventsList.innerHTML += eventHtml;
          });
        }
      })
      .catch(error => {
        console.error('Error loading local events:', error);
        if (eventsList) {
          eventsList.innerHTML = '<p>Unable to load events. Please check back later.</p>';
        }
      });
  }
}

/**
 * Create HTML for an event card
 * @param {Object} event - The event data from Meetup API
 * @param {boolean} isPastEvent - Whether this is a past event
 * @returns {string} HTML string for the event card
 */
function createEventCard(event, isPastEvent = false) {
  // Format date and time
  const eventDate = new Date(event.time);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = formatTime(eventDate);
  
  // Determine location text
  let locationText = 'Location TBD';
  if (event.is_online) {
    locationText = 'Online Event';
  } else if (event.venue) {
    locationText = `${event.venue.name}, ${event.venue.city}`;
  }
  
  // Truncate description if needed
  const truncatedDescription = event.description ? truncateHTML(event.description, 150) : 'No description available';
  
  // Create and return HTML
  return `
    <div class="event-card ${isPastEvent ? 'past-event' : ''}">
      <div class="event-date">
        <span class="month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
        <span class="day">${eventDate.getDate()}</span>
      </div>
      <div class="event-details">
        <h3 class="event-title"><a href="${event.link}" target="_blank" rel="noopener noreferrer">${event.name}</a></h3>
        <p class="event-meta">
          <span class="event-time"><i class="far fa-clock"></i> ${formattedDate}, ${formattedTime}</span>
          <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${locationText}</span>
        </p>
        <div class="event-description">${truncatedDescription}</div>
        <a href="${event.link}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
          ${isPastEvent ? 'View Details' : 'RSVP on Meetup'}
        </a>
      </div>
    </div>
  `;
}

/**
 * Update the next event section in the hero
 * @param {Object} event - The next upcoming event data
 */
function updateNextEventSection(event) {
  const nextEventSection = document.querySelector('#next-event .event-card');
  if (!nextEventSection) return;
  
  // Format date and time
  const eventDate = new Date(event.time);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = formatTime(eventDate);
  
  // Determine location text
  let locationText = 'Location TBD';
  if (event.is_online) {
    locationText = 'Online Event';
  } else if (event.venue) {
    locationText = `${event.venue.name}, ${event.venue.city}`;
  }
  
  // Update the next event section
  nextEventSection.innerHTML = `
    <div class="event-date">
      <span class="month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
      <span class="day">${eventDate.getDate()}</span>
    </div>
    <div class="event-details">
      <h3 class="event-title">${event.name}</h3>
      <p class="event-meta">
        <span class="event-time"><i class="far fa-clock"></i> ${formattedDate}, ${formattedTime}</span>
        <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${locationText}</span>
      </p>
      <a href="${event.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">RSVP on Meetup</a>
    </div>
  `;
}

/**
 * Format time for display
 * @param {Date} date - The date object
 * @returns {string} Formatted time string
 */
function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Truncate HTML content safely
 * @param {string} html - The HTML content to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated HTML string
 */
function truncateHTML(html, maxLength) {
  // Sanitize the input HTML
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  // Create a DOM element to safely manipulate sanitized HTML
  const div = document.createElement('div');
  div.innerHTML = sanitizedHtml;
  
  // Get text content and truncate if necessary
  const text = div.textContent || div.innerText || '';
  if (text.length <= maxLength) return sanitizedHtml;
  
  // Truncate text and return
  return text.substring(0, maxLength) + '...';
}

/**
 * Load team members from JSON data
 */
function loadTeamMembers() {
  const teamGrid = document.querySelector('.team-grid');
  if (!teamGrid) return;
  
  // In a real implementation, this would load from a JSON file or API
  // For now, just simulate with hardcoded data
  const teamMembers = [
    {
      name: 'Team Member Name',
      role: 'President',
      bio: 'Short bio goes here...',
      image: 'images/team/placeholder.jpg',
      social: {
        twitter: 'https://twitter.com/example',
        linkedin: 'https://linkedin.com/in/example',
        github: 'https://github.com/example'
      }
    },
    // More team members would be added here
  ];
  
  // Create HTML for each team member
  teamMembers.forEach(member => {
    const memberHtml = `
      <div class="team-member">
        <img src="${member.image}" alt="${member.name}" class="team-member-image">
        <h3>${member.name}</h3>
        <p class="team-member-role">${member.role}</p>
        <p class="team-member-bio">${member.bio}</p>
        <div class="social-links">
          ${member.social.twitter ? `<a href="${member.social.twitter}" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>` : ''}
          ${member.social.linkedin ? `<a href="${member.social.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ''}
          ${member.social.github ? `<a href="${member.social.github}" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
        </div>
      </div>
    `;
    teamGrid.innerHTML += memberHtml;
  });
}

/**
 * Load sponsors from JSON data
 */
function loadSponsors() {
  const sponsorGrid = document.querySelector('.sponsors-grid');
  if (!sponsorGrid) return;
  
  // In a real implementation, this would load from a JSON file or API
  // For now, just simulate with hardcoded data
  const sponsors = [
    {
      name: 'Sponsor Name',
      level: 'Platinum',
      logo: 'images/sponsors/placeholder.png',
      website: 'https://example.com'
    },
    // More sponsors would be added here
  ];
  
  // Create HTML for each sponsor
  sponsors.forEach(sponsor => {
    const sponsorHtml = `
      <div class="sponsor-card ${sponsor.level.toLowerCase()}">
        <a href="${sponsor.website}" target="_blank" rel="noopener noreferrer">
          <img src="${sponsor.logo}" alt="${sponsor.name}" class="sponsor-logo">
        </a>
        <h3 class="sponsor-name">${sponsor.name}</h3>
        <span class="sponsor-level">${sponsor.level} Sponsor</span>
      </div>
    `;
    sponsorGrid.innerHTML += sponsorHtml;
  });
  
  console.error('Loading sponsors completed');
}

/**
 * Set up form submission handlers
 */
function setupFormHandlers() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const formObject = {};
      for (const [key, value] of formData.entries()) {
        formObject[key] = value;
      }
      
      // In a real implementation, you would send this to an API
      console.error('Form submitted');
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
      
      contactForm.reset();
      contactForm.appendChild(successMessage);
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    });
  }
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page reload
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });
}

/**
 * Helper function to format dates
 */

/**
 * Add active class to current page link
 */

