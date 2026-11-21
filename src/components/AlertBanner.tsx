import { Link } from 'react-router';
import '../assets/css/alert-banner.css';

export type AlertBannerVariant = 'holiday' | 'brand' | 'info';

export interface AlertBannerAction {
  label: string;
  to?: string;
  href?: string;
  external?: boolean;
}

export interface AlertBannerProps {
  variant?: AlertBannerVariant;
  badge?: string;
  title: string;
  description?: string;
  details?: string[];
  primaryAction: AlertBannerAction;
  secondaryAction?: AlertBannerAction;
  ariaLabel?: string;
  className?: string;
}

const AlertBanner = ({
  variant = 'brand',
  badge,
  title,
  description,
  details,
  primaryAction,
  secondaryAction,
  ariaLabel = 'Site announcement',
  className = ''
}: AlertBannerProps) => {
  const wrapperClass = ['alert-banner', `alert-banner--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  const renderAction = (action: AlertBannerAction, modifier: 'primary' | 'secondary') => {
    const buttonClass = `alert-banner__btn alert-banner__btn--${modifier}`;

    if (action.to) {
      return (
        <Link to={action.to} className={buttonClass}>
          {action.label}
        </Link>
      );
    }

    if (action.href) {
      return (
        <a
          href={action.href}
          className={buttonClass}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
        >
          {action.label}
        </a>
      );
    }

    return null;
  };

  return (
    <aside className={wrapperClass} role="region" aria-label={ariaLabel}>
      <div className="alert-banner__inner">
        <div className="alert-banner__content">
          {badge && <span className="alert-banner__badge">{badge}</span>}
          <h2 className="alert-banner__title">{title}</h2>
          {description && <p className="alert-banner__description">{description}</p>}
          {details && details.length > 0 && (
            <ul className="alert-banner__details">
              {details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="alert-banner__actions">
          {renderAction(primaryAction, 'primary')}
          {secondaryAction && renderAction(secondaryAction, 'secondary')}
        </div>
      </div>
    </aside>
  );
};

export default AlertBanner;