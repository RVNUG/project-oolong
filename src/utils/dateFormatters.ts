/**
 * Format a date to a full date string (e.g., "Monday, January 1, 2023")
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a time string (e.g., "7:00 PM")
 * @param timeString The time string to format
 * @returns Formatted time string
 */
export const formatTime = (timeString: string | Date | undefined): string => {
  try {
    // Handle undefined or null
    if (!timeString) {
      return "Time not available";
    }

    // If timeString is already a Date object
    if (timeString instanceof Date) {
      return timeString.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    // If it's a string, attempt to parse it
    // Handle time in format HH:MM:SS or HH:MM
    if (typeof timeString === 'string') {
      // Check if the string has a colon (indicating time format)
      if (timeString.includes(':')) {
        const parts = timeString.split(':');
        if (parts.length >= 2) {
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          
          // Check if parsing was successful
          if (!isNaN(hours) && !isNaN(minutes)) {
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            
            return date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
          }
        }
      }
      
      // Try to parse as ISO string or any other date format
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    }
    
    // If we reach here, we couldn't parse the time
    console.warn(`Could not parse time: ${timeString}`);
    return "Time format error";
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Time not available";
  }
};

/**
 * Convert a Meetup date and time strings to a Date object
 * @param date_str Date string in format "YYYY-MM-DD"
 * @param time_str Time string in format "HH:MM"
 * @returns Date object
 */
export const formatMeetupDateTime = (date_str: string, time_str: string): Date => {
  try {
    return new Date(`${date_str}T${time_str}`);
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date(); // Return current date as fallback
  }
};

/**
 * Format a date for display in event cards (e.g., "Jan 1, 2023")
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatShortDate = (date: Date): string => {
  // Check if the date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Date not available";
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Calculate and format the duration of an event
 * @param startTime Start time in milliseconds
 * @param duration Duration in milliseconds
 * @returns Formatted duration string
 */
export const formatDuration = (startTime: number, duration: number = 7200000): string => {
  // Default duration is 2 hours (7200000 milliseconds)
  const endTime = new Date(startTime + duration);
  const startDate = new Date(startTime);
  
  const startHour = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const endHour = endTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${startHour} - ${endHour}`;
};

/**
 * Get month abbreviation (e.g., "Jan", "Feb")
 */
export const getMonthAbbr = (date: Date): string => {
  // Check if the date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "---";
  }
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[date.getMonth()];
}; 