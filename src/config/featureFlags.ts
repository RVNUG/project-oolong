export enum Feature {
  COMMUNITY_SHOWCASE = 'COMMUNITY_SHOWCASE',
}

type FeatureFlags = {
  [key in Feature]: boolean;
};

const featureFlags: FeatureFlags = {
  [Feature.COMMUNITY_SHOWCASE]: import.meta.env.VITE_FEATURE_COMMUNITY_SHOWCASE === 'true',
};

export const isFeatureEnabled = (feature: Feature): boolean => {
  return featureFlags[feature];
};

// Type guard for compile-time feature flag checking
export const withFeature = <T>(feature: Feature, component: T): T | null => {
  return isFeatureEnabled(feature) ? component : null;
}; 