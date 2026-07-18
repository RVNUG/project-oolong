import { Link } from 'react-router-dom';
import '../assets/css/contact-qq-btn.css';

const ContactQuickQuestionBtn = () => {
  return (
    <div className="contact-qq-btn">
      <Link
        to="/contact"
        className="contact-qq-btn-btn"
        aria-label="Contact us – share an idea or send feedback"
        aria-describedby="contact-qq-btn-tooltip"
      >
        <i className="fa-solid fa-question" aria-hidden="true" />
        <span
          id="contact-qq-btn-tooltip"
          className="contact-qq-btn-tooltip"
          role="tooltip"
        >
          Have an idea? Contact us!
        </span>
      </Link>
    </div>
  );
};

export default ContactQuickQuestionBtn;