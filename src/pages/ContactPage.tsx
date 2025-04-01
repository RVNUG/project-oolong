import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { createBreadcrumbStructuredData } from '../utils/structuredData';
import { getCanonicalUrl } from '../utils/seo';
import '../assets/css/contact.css';

const ContactPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Create breadcrumb structured data
  const baseUrl = getCanonicalUrl();
  const breadcrumbData = createBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Contact', url: `${baseUrl}/contact` }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you'd handle form submission to a backend service
    // For now, just simulate a successful submission
    
    // Reset form and show success message
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: '',
    });
    setSubmitStatus('success');
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setSubmitStatus('idle');
    }, 5000);
  };

  return (
    <div className="contact-page">
      <SEO
        title="Contact Us - Roanoke Valley .NET User Group (RVNUG)"
        description="Reach out to the Roanoke Valley .NET User Group. Whether you have questions, want to become a sponsor, or are interested in speaking at one of our events, we'd love to hear from you."
        keywords="contact, get in touch, email, questions, sponsorship, speaking opportunities, feedback"
        pathName={location.pathname}
      />
      
      <JsonLd data={breadcrumbData} />
      
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with the RVNUG team</p>
      </div>

      <div className="contact-content">
        <div className="contact-options">
          <div className="contact-option">
            <i className="fas fa-envelope"></i>
            <h3>Email</h3>
            <p>
              General Inquiries/Sponsorship: <a href="mailto:officers@rvnug.org">officers@rvnug.org</a><br />
            </p>
          </div>
          
          <div className="contact-option">
            <i className="fab fa-discord"></i>
            <h3>Discord</h3>
            <p>
              Join our Discord server to chat with other members and get real-time updates.
            </p>
            <a 
              href="https://discord.gg/b4hAu9Pdg5" 
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on Discord
            </a>
          </div>
          
          <div className="contact-option">
            <i className="fab fa-meetup"></i>
            <h3>Meetup</h3>
            <p>
              Join our Meetup group to stay updated on events and connect with other members.
            </p>
            <a 
              href="https://www.meetup.com/roanoke-valley-net-user-group/" 
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join on Meetup
            </a>
          </div>
          
          <div className="contact-option">
            <i className="fab fa-github"></i>
            <h3>GitHub</h3>
            <p>
              Check out our code repositories and contribute to our projects.
            </p>
            <a 
              href="https://github.com/rvnug" 
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          
          {submitStatus === 'success' && (
            <div className="success-message">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="error-message">
              There was an error sending your message. Please try again.
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="General Question">General Question</option>
                <option value="Sponsorship">Sponsorship</option>
                <option value="Speaking Opportunity">Speaking Opportunity</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;