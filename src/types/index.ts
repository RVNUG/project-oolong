// Event types
export interface Speaker {
  name: string;
  bio: string;
  image: string;
}

export interface LocalEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  speaker?: Speaker;
  rsvpLink: string;
  calendarLink: string;
}

export interface MeetupVenue {
  name: string;
  city: string;
  address_1?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface MeetupPhoto {
  photo_link: string;
  id?: string;
  highres_link?: string;
  thumb_link?: string;
}

export interface MeetupEvent {
  id: string;
  name: string;
  local_date: string;
  local_time: string;
  duration?: number;
  venue?: MeetupVenue;
  is_online: boolean;
  is_upcoming?: boolean;
  description: string;
  link: string;
  status?: string;
  featured_photo?: MeetupPhoto;
  group?: {
    name: string;
    urlname: string;
  };
}

// Team member types
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

// Sponsor types
export interface Sponsor {
  id: number;
  name: string;
  level: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  description: string;
  logo: string;
  website: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  category: string;
  tags: string[];
  dateAdded: string;
  approved: boolean;
} 