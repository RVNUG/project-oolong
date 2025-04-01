import { TeamMember } from '../types';
import '../assets/css/team-member-card.css';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="team-member-card">
      <div className="member-image-container">
        <img 
          src={member.image || '/images/default-profile.png'} 
          alt={member.name}
          className="member-image"
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