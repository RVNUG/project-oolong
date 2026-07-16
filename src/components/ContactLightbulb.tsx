import { Link } from 'react-router-dom';
import '../assets/css/contact-lightbulb.css';

const ContactLightbulb = () => {
  return (
    <div className="contact-lightbulb">
      <Link
        to="/contact"
        className="contact-lightbulb-btn"
        aria-label="Contact us – share an idea or send feedback"
        aria-describedby="contact-lightbulb-tooltip"
      >
        <i className="fas fa-lightbulb" aria-hidden="true"></i>
        <span
          id="contact-lightbulb-tooltip"
          className="contact-lightbulb-tooltip"
          role="tooltip"
        >
          Have an idea? Contact us!
        </span>
      </Link>
    </div>
  );
};

export default ContactLightbulb;