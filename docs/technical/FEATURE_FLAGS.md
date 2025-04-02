# Feature Flag Management

This document outlines how feature flags are implemented and managed in the RVNUG website.

## Overview

Feature flags allow us to:
- Enable/disable features in different environments
- Gradually roll out new features
- A/B test different implementations
- Quickly disable problematic features

## Implementation

### Feature Flag Configuration

Feature flags are managed through environment variables:

```typescript
// src/config/featureFlags.ts
export interface FeatureFlags {
  ENABLE_YOUTUBE_FEED: boolean;
  ENABLE_MEETUP_EVENTS: boolean;
  ENABLE_DARK_MODE: boolean;
  ENABLE_SEARCH: boolean;
}

export const defaultFlags: FeatureFlags = {
  ENABLE_YOUTUBE_FEED: true,
  ENABLE_MEETUP_EVENTS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_SEARCH: false,
};
```

### Local Development

1. **Environment File**:
Create a `.env.local` file in the project root:
```bash
VITE_ENABLE_YOUTUBE_FEED=true
VITE_ENABLE_MEETUP_EVENTS=true
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_SEARCH=false
```

2. **Usage in Code**:
```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function MyComponent() {
  const isEnabled = useFeatureFlag('ENABLE_DARK_MODE');
  
  return isEnabled ? <DarkModeContent /> : <LightModeContent />;
}
```

### Production Environment

Feature flags in production are managed through GitHub Secrets:

1. **Setting Flags**:
   - Go to repository Settings
   - Navigate to Secrets and Variables
   - Add or update environment variables

2. **Deployment**:
   - GitHub Actions workflow automatically includes feature flags
   - Variables are injected during build process
   - Changes require new deployment

## Managing Feature Flags

### Adding New Flags

1. Update TypeScript interface:
```typescript
export interface FeatureFlags {
  // ... existing flags ...
  NEW_FEATURE_FLAG: boolean;
}
```

2. Add default value:
```typescript
export const defaultFlags: FeatureFlags = {
  // ... existing defaults ...
  NEW_FEATURE_FLAG: false,
};
```

3. Update environment files and GitHub Secrets

### Removing Flags

1. Remove feature flag code:
```typescript
// Before
if (useFeatureFlag('OLD_FEATURE')) {
  return <OldFeature />;
}
return <NewFeature />;

// After
return <NewFeature />;
```

2. Remove from configuration:
   - Delete from `FeatureFlags` interface
   - Remove from `defaultFlags`
   - Clean up environment variables
   - Remove from GitHub Secrets

### Best Practices

1. **Naming**:
   - Use SCREAMING_SNAKE_CASE
   - Prefix with `ENABLE_` for toggles
   - Be descriptive and specific

2. **Documentation**:
   - Document purpose of each flag
   - Note dependencies between flags
   - Track temporary vs. permanent flags

3. **Testing**:
   - Test both enabled and disabled states
   - Verify flag removal is safe
   - Check for flag dependencies

4. **Cleanup**:
   - Regularly review active flags
   - Remove unused flags
   - Document flag lifecycle

## Troubleshooting

### Common Issues

1. **Flag Not Working**:
   - Verify environment variable name
   - Check build configuration
   - Confirm GitHub Secret exists
   - Review deployment logs

2. **Type Errors**:
   - Update TypeScript interface
   - Check import paths
   - Verify flag name spelling

3. **Build Failures**:
   - Validate environment files
   - Check GitHub Secrets
   - Review workflow logs

### Debug Tools

1. **Local Development**:
```typescript
// src/utils/debug.ts
export const logFeatureFlags = () => {
  console.log('Current Feature Flags:', import.meta.env);
};
```

2. **Production**:
- Check deployment logs
- Review build artifacts
- Monitor error tracking

## Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) 