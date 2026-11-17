/**
 * Generic community splash photography (Unsplash) for event-style sections.
 * Officer headshots stay in team.json; these images illustrate what RVNUG does.
 */
export type CommunitySplashPhoto = {
  /** Path under public/, e.g. /images/community/... */
  src: string;
  alt: string;
  credit: {
    photographer: string;
    unsplashUrl: string;
  };
};

/** Homepage “Community moments” pair — tech talk + informal meetup. */
export const homepageCommunityMoments: CommunitySplashPhoto[] = [
  {
    src: '/images/community/splash-tech-talk.jpg',
    alt: 'People seated in a conference room watching a presentation',
    credit: {
      photographer: 'Product School',
      unsplashUrl: 'https://unsplash.com/photos/5ah4uuAqTNc'
    }
  },
  {
    src: '/images/community/splash-code-coffee.jpg',
    alt: 'Laptop open on a desk for hands-on coding or learning',
    credit: {
      photographer: 'Christina @ wocintechchat.com',
      unsplashUrl: 'https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-954uFihh4eA'
    }
  }
];

/** Team page banner — collaboration / user-group energy. */
export const teamPageCommunitySplash: CommunitySplashPhoto = {
  src: '/images/community/splash-collaboration.jpg',
  alt: 'Developers collaborating around a table with laptops',
  credit: {
    photographer: 'Headway',
    unsplashUrl: 'https://unsplash.com/photos/5QgIuuBxKwM'
  }
};