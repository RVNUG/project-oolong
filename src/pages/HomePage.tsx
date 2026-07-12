import { Link, useLocation } from 'react-router-dom';
import useEvents from '../hooks/useEvents';
import useSponsors from '../hooks/useSponsors';
import EventCard from '../components/EventCard';
import SponsorCard from '../components/SponsorCard';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import { formatHeroEventCtaLabel } from '../utils/dateFormatters';
import '../assets/css/home.css';
import { useState, useEffect, useRef } from 'react';

// Import logo for use in hero section
import logo from '../assets/images/roanoke-star-128-logo.png';
// Import icons
import {
  FaGithub,
  FaYoutube,
  FaMeetup,
  FaDiscord,
  FaNewspaper
} from 'react-icons/fa';
import { getResourceUrl } from '../utils/config';

// YouTube channel ID for RVNUG
const YOUTUBE_CHANNEL_ID = import.meta.env.VITE_RVNUG_YT_CHANNEL_ID;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;
const DISCORD_URL = import.meta.env.VITE_APP_DISCORD_URL || 'https://discord.gg/invite/b4hAu9Pdg5';
const NEWSLETTER_URL = "http://eepurl.com/ddlwBz";

// Interface for YouTube video info
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

// Interface for local video data
interface LocalVideoData {
  title: string;
  video_id: string;
  published_at: string;
  thumbnail_url: string;
  video_url: string;
}

const HomePage = () => {
  const location = useLocation();
  const { loading: eventsLoading, error: eventsError, upcomingEvents } = useEvents();
  const { loading: sponsorsLoading, error: sponsorsError, sponsors } = useSponsors();
  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loadingVideo, setLoadingVideo] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextEvent = upcomingEvents[0];
  const proofTalk = videos[0] ?? latestVideo;

  // Function to fetch the latest YouTube video
  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideo(true);
      setVideoError(null);
      
      try {
        // First, try to fetch videos from the public data directory
        try {
          const videosUrl = getResourceUrl('data/videos.json');
          const response = await fetch(videosUrl);
          
          if (response.ok) {
            const videosData: LocalVideoData[] = await response.json();
            
            if (videosData && videosData.length > 0) {
              const videosList = videosData.map(localVideo => ({
                id: localVideo.video_id,
                title: localVideo.title,
                thumbnail: localVideo.thumbnail_url,
                publishedAt: localVideo.published_at
              }));
              
              setVideos(videosList);
              setLatestVideo(videosList[0]);
              setLoadingVideo(false);
              return;
            }
          }
        } catch (fetchError) {
          console.warn('Failed to fetch videos from public directory, will try YouTube API', fetchError);
        }

        // Check if environment variables are set
        if (!YOUTUBE_CHANNEL_ID || !YOUTUBE_API_KEY) {
          const errorMessage = import.meta.env.DEV 
            ? 'YouTube API credentials not configured. Please check your .env file.'
            : 'YouTube API credentials not configured. Please check GitHub repository secrets.';
          
          console.error('YouTube API credentials not configured:', {
            hasChannelId: !!YOUTUBE_CHANNEL_ID,
            hasApiKey: !!YOUTUBE_API_KEY,
            isDev: import.meta.env.DEV
          });
          throw new Error(errorMessage);
        }

        // If no local data, fall back to YouTube API
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!channelResponse.ok) {
          throw new Error('Failed to fetch channel data');
        }
        
        const channelData = await channelResponse.json();
        const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
        
        if (!uploadsPlaylistId) {
          throw new Error('Could not find uploads playlist');
        }
        
        // Then, get the latest video from the uploads playlist
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=3&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!videosResponse.ok) {
          throw new Error('Failed to fetch videos data');
        }
        
        const videosData = await videosResponse.json();
        const videoItem = videosData.items[0]?.snippet;
        
        if (videoItem) {
          setLatestVideo({
            id: videoItem.resourceId.videoId,
            title: videoItem.title,
            thumbnail: videoItem.thumbnails.maxres?.url || videoItem.thumbnails.high?.url || videoItem.thumbnails.default?.url,
            publishedAt: videoItem.publishedAt
          });
        } else {
          throw new Error('No videos found');
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
        setVideoError(error instanceof Error ? error.message : 'Failed to fetch YouTube data');
        
        // Fallback to cached video if available
        const cachedVideo = localStorage.getItem('rvnug_latest_video');
        if (cachedVideo) {
          try {
            const parsedVideo = JSON.parse(cachedVideo);
            setLatestVideo(parsedVideo);
            setVideos([parsedVideo]);
          } catch (e) {
            console.error('Error parsing cached video data:', e);
          }
        }
      } finally {
        setLoadingVideo(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // Cache the latest video when it changes
  useEffect(() => {
    if (latestVideo) {
      try {
        localStorage.setItem('rvnug_latest_video', JSON.stringify(latestVideo));
      } catch (error) {
        console.error('Error caching latest video:', error);
      }
    }
  }, [latestVideo]);

  // Function to navigate to the next video
  const nextVideo = () => {
    if (videos.length <= 1) return;
    setCurrentVideoIndex(prevIndex => (prevIndex + 1) % videos.length);
  };

  // Function to navigate to the previous video
  const prevVideo = () => {
    if (videos.length <= 1) return;
    setCurrentVideoIndex(prevIndex => (prevIndex - 1 + videos.length) % videos.length);
  };

  // Update active video when currentVideoIndex changes
  useEffect(() => {
    if (videos.length > 0) {
      setLatestVideo(videos[currentVideoIndex]);
      
      // Apply animation effect
      if (carouselRef.current) {
        const thumbnail = carouselRef.current.querySelector('.youtube-thumbnail') as HTMLElement;
        if (thumbnail) {
          thumbnail.style.opacity = '0';
          setTimeout(() => {
            thumbnail.style.opacity = '1';
          }, 50);
        }
      }
    }
  }, [currentVideoIndex, videos]);

  // Function to open video in a new tab
  const openVideo = () => {
    if (latestVideo) {
      window.open(`https://www.youtube.com/watch?v=${latestVideo.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl }
  ]);

  const heroCta = nextEvent
    ? {
        to: `/event/${nextEvent.id}`,
        label: formatHeroEventCtaLabel(nextEvent.name, nextEvent.local_date)
      }
    : {
        to: '/events',
        label: 'See upcoming events'
      };

  return (
    <div className="home-page">
      <SEO
        title="Roanoke Valley .NET User Group (RVNUG) - Home"
        description="The Roanoke Valley .NET User Group is a community of developers passionate about .NET technologies in the Roanoke Valley area of Virginia. Join us for events, learning, and networking."
        keywords=".NET, C#, software development, programming, Roanoke, user group, technology, developers, Virginia, tech community"
        pathName={location.pathname}
      />
      
      {/* Add structured data */}
      <JsonLd data={breadcrumbData} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <img src={logo} alt="" className="hero-logo" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-text">
            <h1>Roanoke Valley <span className="highlight">.NET</span> User Group</h1>
            <p>
              Meet Roanoke-area developers in person each month for practical talks,
              code-and-coffee sessions, and real conversations.
            </p>
          </div>
          <div className="hero-cta">
            <Link to={heroCta.to} className="btn btn-primary pulse-btn">
              {heroCta.label}
            </Link>
            <a href="#what-to-expect" className="btn btn-secondary">What to expect</a>
          </div>
        </div>
      </section>

      {/* Community proof — stats + latest talk */}
      <section className="community-proof" aria-label="Community proof">
        <div className="community-proof-inner">
          <div className="community-proof-stats">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Members</span>
            </div>
          </div>
          {!loadingVideo && proofTalk && (
            <a
              className="community-proof-talk"
              href={`https://www.youtube.com/watch?v=${proofTalk.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="proof-talk-label">Latest talk</span>
              <span className="proof-talk-title">{proofTalk.title}</span>
            </a>
          )}
          {!loadingVideo && !proofTalk && (
            <a className="community-proof-talk" href="#past-talks">
              <span className="proof-talk-label">Latest talk</span>
              <span className="proof-talk-title">Browse session recordings</span>
            </a>
          )}
        </div>
      </section>

      {/* What to expect — replaces What We Offer */}
      <section id="what-to-expect" className="what-to-expect">
        <h2 className="section-title">What to expect</h2>
        <p className="what-to-expect-lead">Show up once — no pitch, no pressure.</p>
        <ol className="expect-list">
          <li className="expect-item">
            <h3>Who shows up</h3>
            <p>
              Software developers from Roanoke, Blacksburg, and the New River Valley — juniors
              through seniors. .NET, full stack, frontend, backend, JavaScript, cloud, DevOps,
              AI — you name it.
            </p>
          </li>
          <li className="expect-item">
            <h3>What happens</h3>
            <p>
              Practical talks most months, plus Code &amp; Coffee coworking-style sessions —
              informal, in-person, and discussion-friendly.
            </p>
          </li>
          <li className="expect-item">
            <h3>All experience levels welcome</h3>
            <p>
              Beginners and experienced developers alike. Plenty of members dig into technical
              deep dives — and we keep things approachable for people who&apos;ve never been to
              a meetup before. New members are always welcome.
            </p>
          </li>
        </ol>
      </section>

      {/* Discord-led community section */}
      <section className="community-cta">
        <div className="cta-content">
          <h2>Between meetups, keep the conversation going</h2>
          <p>
            Our Discord is where local developers share job leads, event chatter, help on side
            projects, and follow-up discussion after talks.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary discord-primary-btn"
          >
            <FaDiscord /> Join the Discord
          </a>
          <div className="also-find-us">
            <span className="also-find-us-label">Also find us on</span>
            <div className="cta-buttons">
              <a
                href="https://www.meetup.com/Roanoke-Valley-NET-User-Group/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-social"
              >
                <FaMeetup /> Meetup
              </a>
              <a
                href="https://www.youtube.com/@rvnug"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-social"
              >
                <FaYoutube /> YouTube
              </a>
              <a
                href="https://github.com/rvnug"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-social"
              >
                <FaGithub /> GitHub
              </a>
              <a
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-social"
              >
                <FaNewspaper /> Newsletter
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Events Section */}
      <section className="upcoming-events">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <Link to="/events" className="view-all">View All Events</Link>
        </div>
        
        {eventsLoading ? (
          <div className="loading">Loading events...</div>
        ) : eventsError ? (
          <div className="error-message">{eventsError}</div>
        ) : upcomingEvents.length > 0 ? (
          <div className="events-preview">
            {upcomingEvents.slice(0, 2).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="no-events">No upcoming events scheduled. Check back soon!</div>
        )}
      </section>

      {/* YouTube Spotlight Section */}
      <section id="past-talks" className="youtube-spotlight">
        <div className="section-header">
          <h2>Session Recordings</h2>
          <a 
            href="https://www.youtube.com/@rvnug-roanokevalleydotnetu6781" 
            className="view-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Our YouTube Channel
          </a>
        </div>
        <div className="youtube-content">
          <div className="youtube-description">
            <h3>Watch Our Past Sessions</h3>
            <p>
              Missed a meeting? Want to revisit a talk? We record our sessions and make them available on our YouTube channel.
              Check out our growing library of presentations, tutorials, and discussions from industry experts.
            </p>
            <button 
              className="youtube-btn"
              onClick={openVideo}
              disabled={loadingVideo || !latestVideo}
            >
              <i className="fas fa-play-circle"></i> Watch This Video
            </button>
          </div>
          
          {loadingVideo ? (
            <div className="youtube-placeholder">
              <div className="placeholder-content">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading video data...</p>
              </div>
            </div>
          ) : videoError && videos.length === 0 ? (
            <div className="youtube-placeholder youtube-error">
              <div className="placeholder-content">
                <i className="fas fa-exclamation-circle"></i>
                <p>Couldn't load video data</p>
                <p className="error-details">{videoError}</p>
              </div>
            </div>
          ) : videos.length > 0 ? (
            <div className="video-carousel-container">
              <div className="video-carousel" ref={carouselRef}>
                <div className="youtube-embed">
                  <div 
                    className="youtube-thumbnail" 
                    onClick={openVideo}
                    tabIndex={0}
                    role="button"
                    aria-label={`Watch ${latestVideo?.title}`}
                  >
                    <img 
                      src={latestVideo?.thumbnail} 
                      alt={latestVideo?.title}
                      className="thumbnail-img"
                    />
                    <div className="play-button-overlay">
                      <i className="fas fa-play-circle"></i>
                    </div>
                    <div className="video-title-overlay">
                      <h4>{latestVideo?.title}</h4>
                      <span>
                        {latestVideo?.publishedAt && new Date(latestVideo.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {videos.length > 1 && (
                  <div className="carousel-controls">
                    <button 
                      className="carousel-control prev" 
                      onClick={prevVideo}
                      aria-label="Previous video"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <div className="carousel-indicators">
                      {videos.map((_, index) => (
                        <button 
                          key={index} 
                          className={`carousel-indicator ${index === currentVideoIndex ? 'active' : ''}`}
                          onClick={() => setCurrentVideoIndex(index)}
                          aria-label={`Go to video ${index + 1}`}
                          aria-current={index === currentVideoIndex}
                        ></button>
                      ))}
                    </div>
                    <button 
                      className="carousel-control next" 
                      onClick={nextVideo}
                      aria-label="Next video"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="youtube-placeholder">
              <div className="placeholder-content">
                <i className="fas fa-video-slash"></i>
                <p>No videos available</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section — mission only; stats live in community proof */}
      <section className="about-section">
        <div className="about-content">
          <h2 className="section-title">About RVNUG</h2>
          <div className="about-description about-description-centered">
            <p>
              Roanoke Valley .NET User Group is a community-driven organization dedicated to sharing knowledge
              and experience in .NET and many other open and closed software development technologies.
            </p>
            <p>
              Our mission is to foster a collaborative environment where developers of all skill levels
              can learn, network, and grow professionally through regular meetups, events, and knowledge sharing.
            </p>
            <Link to="/team" className="btn btn-primary">Meet Our Team</Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors-section">
        <div className="section-header">
          <h2>Our Sponsors</h2>
          <Link to="/sponsors" className="view-all">View All Sponsors</Link>
        </div>
        
        {sponsorsLoading ? (
          <div className="loading">Loading sponsors...</div>
        ) : sponsorsError ? (
          <div className="error-message">{sponsorsError}</div>
        ) : sponsors.length > 0 ? (
          <div className="sponsors-preview">
            {sponsors.map(sponsor => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} size="normal" />
            ))}
          </div>
        ) : (
          <div className="no-sponsors">No sponsors to display. Interested in becoming a sponsor? <Link to="/contact">Contact us</Link>.</div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
