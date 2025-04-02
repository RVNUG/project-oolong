import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Feature, isFeatureEnabled } from './featureFlags';

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const SponsorsPage = lazy(() => import('../pages/SponsorsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const CommunityShowcasePage = lazy(() => import('../pages/CommunityShowcasePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/event/:id',
    element: <EventDetailPage />,
  },
  {
    path: '/team',
    element: <TeamPage />,
  },
  {
    path: '/sponsors',
    element: <SponsorsPage />,
  },
  ...(isFeatureEnabled(Feature.COMMUNITY_SHOWCASE)
    ? [
        {
          path: '/showcase',
          element: <CommunityShowcasePage />,
        },
      ]
    : []),
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]; 