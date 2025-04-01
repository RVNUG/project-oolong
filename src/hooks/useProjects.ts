import { useState, useEffect } from 'react';
import { Project } from '../types';
import { getResourceUrl } from '../utils/config';

// Function to get correct image path
const getProjectImagePath = (imageName: string): string => {
  return getResourceUrl(`images/projects/${imageName}`);
};

// Sample projects data - this would typically come from an API
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Blazor Component Library',
    description: 'A comprehensive library of reusable Blazor components for modern web applications.',
    author: 'Jane Smith',
    githubUrl: 'https://github.com/janesmith/blazor-components',
    liveUrl: 'https://blazor-components-demo.example.com',
    imageUrl: getProjectImagePath('default-project.svg'),
    category: 'library',
    tags: ['Blazor', 'C#', 'Components', 'UI'],
    dateAdded: '2023-10-15',
    approved: true
  },
  {
    id: '2',
    title: '.NET Core API Starter Kit',
    description: 'A starter template for building robust RESTful APIs with .NET Core and Entity Framework.',
    author: 'John Doe',
    githubUrl: 'https://github.com/johndoe/dotnet-api-starter',
    liveUrl: 'https://api-starter-docs.example.com',
    imageUrl: getProjectImagePath('default-project.svg'),
    category: 'template',
    tags: ['.NET Core', 'API', 'Entity Framework', 'REST'],
    dateAdded: '2023-09-28',
    approved: true
  },
  {
    id: '3',
    title: 'Xamarin Healthcare App',
    description: 'A cross-platform mobile application for healthcare providers, featuring appointment scheduling and patient records.',
    author: 'Sara Johnson',
    githubUrl: 'https://github.com/sarajohnson/xamarin-healthcare',
    liveUrl: '',
    imageUrl: getProjectImagePath('default-project.svg'),
    category: 'application',
    tags: ['Xamarin', 'C#', 'Mobile', 'Healthcare'],
    dateAdded: '2023-11-05',
    approved: true
  },
  {
    id: '4',
    title: 'ML.NET Sentiment Analyzer',
    description: 'A text sentiment analysis tool built with ML.NET that can classify text as positive, negative, or neutral.',
    author: 'Michael Chen',
    githubUrl: 'https://github.com/michaelchen/mlnet-sentiment',
    liveUrl: 'https://mlnet-sentiment.example.com',
    imageUrl: getProjectImagePath('default-project.svg'),
    category: 'machine learning',
    tags: ['ML.NET', 'AI', 'Sentiment Analysis', 'NLP'],
    dateAdded: '2023-12-01',
    approved: true
  },
  {
    id: '5',
    title: 'ASP.NET Core E-Commerce Platform',
    description: 'A complete e-commerce solution built with ASP.NET Core, featuring product management, cart, and checkout.',
    author: 'Alex Wilson',
    githubUrl: 'https://github.com/alexwilson/aspnet-ecommerce',
    liveUrl: 'https://aspnet-ecommerce-demo.example.com',
    imageUrl: getProjectImagePath('default-project.svg'),
    category: 'application',
    tags: ['ASP.NET Core', 'E-Commerce', 'MVC', 'SQL Server'],
    dateAdded: '2023-08-17',
    approved: true
  },
  {
    id: '6',
    title: 'Unity Game Development Framework',
    description: 'A C# framework for Unity developers to streamline game development with reusable components and patterns.',
    author: 'Olivia Martinez',
    githubUrl: 'https://github.com/oliviamartinez/unity-framework',
    liveUrl: '',
    imageUrl: getProjectImagePath('default-project.svg'),
    category: 'framework',
    tags: ['Unity', 'C#', 'Game Development', '3D'],
    dateAdded: '2023-09-10',
    approved: true
  }
];

interface UseProjectsResult {
  loading: boolean;
  error: string | null;
  projects: Project[];
}

const useProjects = (): UseProjectsResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/projects');
        // const data = await response.json();
        
        // For now, we'll use the sample data with a simulated delay
        setTimeout(() => {
          setProjects(sampleProjects);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  return { loading, error, projects };
};

export default useProjects; 