import { MeetupEvent } from '../types';

/**
 * Format venue address to avoid duplication between address_1 and city/state
 * @param venue The venue object from the event
 * @param isOnline Whether the event is online
 * @returns Formatted address string
 */
export const formatVenueAddress = (venue?: MeetupEvent['venue'], isOnline = false): string => {
  if (!venue || isOnline) {
    return '';
  }

  // If address_1 is empty, just return city, state, zip
  if (!venue.address_1) {
    return `${venue.city || ''}, ${venue.state || ''} ${venue.zip || ''}`.trim().replace(/^,\s+/, '');
  }

  // Create the city/state format for comparison
  const cityStateFormat = `${venue.city || ''}, ${venue.state || ''}`.trim();
  const cityStateFormatWithSpace = `${venue.city || ''},  ${venue.state || ''}`.trim();
  
  // Check if address_1 is just the city/state
  const isAddressSameAsCityState = 
    venue.address_1 === cityStateFormat ||
    venue.address_1 === cityStateFormatWithSpace;
  
  if (isAddressSameAsCityState) {
    // Return just the city/state without duplicating
    return `${venue.city || ''}, ${venue.state || ''} ${venue.zip || ''}`.trim();
  } else {
    // Format the full address, carefully handling empty components
    const addressParts = [];
    
    if (venue.address_1) {
      addressParts.push(venue.address_1);
    }
    
    if (venue.city) {
      addressParts.push(venue.city);
    }
    
    if (venue.state) {
      addressParts.push(venue.state);
    }
    
    // Combine with commas
    let formattedAddress = addressParts.join(', ');
    
    // Add zip if available
    if (venue.zip) {
      formattedAddress += ` ${venue.zip}`;
    }
    
    return formattedAddress.trim();
  }
};

/**
 * Check if an event is online based on its properties
 * @param event The MeetupEvent object
 * @returns Boolean indicating if the event is online
 */
export const isEventOnline = (event: MeetupEvent): boolean => {
  return Boolean(
    event.is_online || 
    (event.venue && event.venue.name === 'Online Event')
  );
}; 