import { TeamMember } from '../types';
import '../assets/css/team-member-card.css';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import LazyImage from './LazyImage';
import { getImageWithFallback } from '../utils/imagePaths';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  // Use the utility to get the correct image path with fallback
  const imageSrc = getImageWithFallback(member.image);

  return (
    <div className="team-member-card">
      <div className="member-image-container">
        <LazyImage 
          src={imageSrc} 
          alt={member.name}
          className="member-image"
          width="100%"
          height="100%"
        />
      </div>
      <div className="member-content">
        <h3 className="member-name">{member.name}</h3>
        <p className="member-role">{member.role}</p>
        <p className="member-bio">{member.bio}</p>
        
        <div className="member-social">
          {member.linkedin && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <FaLinkedin />
            </a>
          )}
          
          {member.twitter && (
            <a 
              href={member.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${member.name}'s Twitter profile`}
            >
              <FaTwitter />
            </a>
          )}
          
          {member.github && (
            <a 
              href={member.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${member.name}'s GitHub profile`}
            >
              <FaGithub />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard; 