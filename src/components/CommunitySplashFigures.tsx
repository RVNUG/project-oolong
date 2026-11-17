import type { CommunitySplashPhoto } from '../config/communitySplash';

type CommunitySplashFiguresProps = {
  photos: CommunitySplashPhoto[];
  className?: string;
  showCredits?: boolean;
};

const CommunitySplashFigures = ({
  photos,
  className = 'community-moment-photos',
  showCredits = true
}: CommunitySplashFiguresProps) => (
  <>
    <div className={className}>
      {photos.map((photo) => (
        <figure className="community-moment-photo" key={photo.src}>
          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
        </figure>
      ))}
    </div>
    {showCredits && (
      <p className="community-splash-credits">
        Photos{' '}
        {photos.map((photo, index) => (
          <span key={photo.src}>
            {index > 0 && (index === photos.length - 1 ? ' and ' : ', ')}
            <a href={photo.credit.unsplashUrl} target="_blank" rel="noopener noreferrer">
              {photo.credit.photographer}
            </a>
            {' '}
            <span className="sr-only">on Unsplash</span>
          </span>
        ))}
        {' '}
        via{' '}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
          Unsplash
        </a>
      </p>
    )}
  </>
);

export default CommunitySplashFigures;