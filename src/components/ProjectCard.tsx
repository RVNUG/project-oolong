import { useState } from 'react';
import { Project } from '../types';
import '../assets/css/project-card.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.warn(`Failed to load project image: ${project.imageUrl}`);
    setImageError(true);
  };

  return (
    <div className="project-card">
      <div className="project-image">
        {imageError ? (
          <div className="project-image-fallback">
            <div className="project-image-fallback-icon">
              <i className="fas fa-code" aria-hidden="true"></i>
            </div>
            <span>{project.title}</span>
          </div>
        ) : (
          <img 
            src={project.imageUrl} 
            alt={`Screenshot of ${project.title}`} 
            onError={handleImageError} 
          />
        )}
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-author">By {project.author}</p>
        <p className="project-description">{project.description}</p>
        
        <div className="project-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="project-links">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} GitHub repository`}
            >
              <i className="fab fa-github" aria-hidden="true"></i> GitHub
            </a>
          )}
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live site`}
            >
              <i className="fas fa-external-link-alt" aria-hidden="true"></i> View Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 