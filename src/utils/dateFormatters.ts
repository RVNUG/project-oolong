/**
 * Format a date to a full date string (e.g., "Monday, January 1, 2023")
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatFullDate = (dateString: string): string => {
  try {
    // Create date with explicit UTC handling to avoid timezone issues
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
      const day = parseInt(dateParts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const date = new Date(year, month, day);
        
        // Validate that the date is valid
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date string: ${dateString}`);
          return "Date not available";
        }
        
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    
    // Fallback to regular Date constructor if format is not YYYY-MM-DD
    const date = new Date(dateString);
    
    // Validate that the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return "Date not available";
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting full date:', error);
    return "Date not available";
  }
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

    // If it's a string in HH:MM format (24-hour format from events.json)
    if (typeof timeString === 'string' && timeString.match(/^\d{1,2}:\d{2}$/)) {
      const [hoursStr, minutesStr] = timeString.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      if (!isNaN(hours) && !isNaN(minutes)) {
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    }
    
    // For other string formats, try to parse 
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
    return timeString.toString(); // Return the original string if we can't parse it
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
    // Parse date parts to avoid timezone issues
    const [year, month, day] = date_str.split('-').map(Number);
    const [hours, minutes] = time_str.split(':').map(Number);
    
    // Create Date with explicit parts
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1); // Months are 0-indexed
    date.setDate(day);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
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