# Data Consolidation - November 2025

## Overview
Consolidated all data sources to use `public/data/` as the single source of truth, eliminating data duplication and sync issues between `src/assets/data/` and `public/data/`.

## Problem
The application had two separate data repositories:
- **`public/data/`** - Updated via PRs from automation scripts
- **`src/assets/data/`** - Statically imported in React code

This caused several issues:
1. **Videos data was out of sync** - `public/data/videos.json` had 3 videos (latest: Sept 8), but `src/assets/data/videos.json` only had 3 videos with the latest being Sept 1 (missing the newest video)
2. **Sponsors data was completely different** - Public had 4 sponsors, assets only had 2 with different schema
3. **Events data was out of sync** - Public had 13 events (updated Nov 6), assets had 10 events (updated Sept 4)
4. **Team data inconsistency** - Only existed in assets, but services tried to fetch from public
5. **Duplicate service implementations** - Multiple services fetching the same data from different sources

## Solution Implemented

### Changes Made

#### 1. Moved Data Files
- ✅ Copied `team.json` from `src/assets/data/` to `public/data/`
- ✅ Deleted entire `src/assets/data/` directory (events.json, sponsors.json, team.json, videos.json)

#### 2. Updated Services
- ✅ **teamService.ts** - Updated to fetch from `/data/team.json` using `getResourceUrl()` utility
- ✅ **sponsorsService.ts** - Already fetching from `/data/sponsors.json` (no change needed)
- ✅ **eventsService.ts** - Already fetching from `/data/events.json` (no change needed)
- ✅ **Removed dataService.ts** - Redundant service that was duplicating functionality

#### 3. Updated Components
- ✅ **HomePage.tsx** - Changed from importing `videosData` from assets to fetching from `/data/videos.json` at runtime
- ✅ **useTeamMembers.ts** - Updated to use `teamService` instead of `dataService`

#### 4. Verified Consistency
- ✅ No linter errors
- ✅ Build completes successfully
- ✅ All data now fetched from `public/data/` at runtime

## Benefits

### 1. Single Source of Truth
All data now lives in `public/data/` and is fetched at runtime, ensuring:
- PRs that update data files are immediately reflected without requiring a rebuild
- No risk of stale data in the application
- No duplication or sync issues

### 2. Simplified Architecture
- Removed duplicate service implementations
- Consistent pattern: all services use `getResourceUrl()` utility
- Clearer separation: `/public/data/` for dynamic data, `/src/assets/` for static assets (images, CSS, etc.)

### 3. Better Maintainability
- One place to update data files
- Easier to understand data flow
- Automation scripts (meetup_events.py, youtube_latest_videos.py) only need to target `public/data/`

## Data Files Location

All data files are now in `public/data/`:
- `events.json` - Meetup events (updated via meetup_events.py)
- `sponsors.json` - Sponsor information
- `team.json` - Team member profiles
- `videos.json` - YouTube videos (updated via youtube_latest_videos.py)

## Service Architecture

### Current Pattern
All services follow this pattern:

```typescript
import { getResourceUrl } from '../utils/config';

export const fetchData = async () => {
  const dataUrl = getResourceUrl('data/filename.json');
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return await response.json();
};
```

### Active Services
- **teamService.ts** - Fetches team members
- **sponsorsService.ts** - Fetches sponsors
- **eventsService.ts** - Fetches events from Meetup
- **meetupService.ts** - Direct Meetup API integration

## Hooks Using These Services

- **useTeam.ts** - Used by TeamPage
- **useSponsors.ts** - Used by HomePage and SponsorsPage
- **useEvents.ts** - Used by HomePage, EventsPage, EventDetailPage
- **useTeamMembers.ts** - Enhanced hook with caching (currently unused but available)

## Automation Integration

The following scripts should continue updating `public/data/`:

### Python Scripts
- **`scripts/meetup_events.py`** → Updates `public/data/events.json`
- **`scripts/youtube_latest_videos.py`** → Updates `public/data/videos.json`

These scripts are typically run via GitHub Actions and create PRs that update the data files.

## Verification Steps

To verify the changes work correctly:

1. **Build Test**: ✅ Completed successfully
   ```bash
   npm run build
   ```

2. **Local Development**:
   ```bash
   npm run dev
   ```
   - Navigate to homepage - should show latest videos
   - Navigate to /team - should show team members
   - Navigate to /sponsors - should show sponsors
   - Navigate to /events - should show events

3. **Check Console**: No errors related to missing data files

## Future Considerations

### Data Update Process
1. PR automation updates files in `public/data/`
2. PR is reviewed and merged
3. Site is rebuilt and deployed
4. Users see fresh data immediately (no client rebuild needed)

### Adding New Data Files
If you need to add a new data file:

1. Add JSON file to `public/data/`
2. Create a service in `src/services/` following the pattern above
3. Create a hook in `src/hooks/` if needed
4. Use the hook in your components

### Manual Data Updates
To manually update data:
1. Edit the JSON file in `public/data/`
2. Commit and push
3. No need to touch anything in `src/`

## Breaking Changes

⚠️ **None for end users** - All changes are internal refactoring

### For Developers
- If you were importing data from `src/assets/data/`, those files no longer exist
- Use the appropriate service/hook instead
- All data is now fetched at runtime, not bundled at build time

## Files Modified
- ✅ `public/data/team.json` (created)
- ✅ `src/services/teamService.ts` (updated to fetch from public)
- ✅ `src/pages/HomePage.tsx` (updated to fetch videos from public)
- ✅ `src/hooks/useTeamMembers.ts` (updated to use teamService)

## Files Deleted
- ✅ `src/assets/data/events.json`
- ✅ `src/assets/data/sponsors.json`
- ✅ `src/assets/data/team.json`
- ✅ `src/assets/data/videos.json`
- ✅ `src/assets/data/` (directory)
- ✅ `src/services/dataService.ts`

## Testing Checklist

- [x] Build completes without errors
- [x] No linter errors
- [ ] Homepage displays videos correctly
- [ ] Team page displays team members
- [ ] Sponsors page displays sponsors
- [ ] Events page displays events
- [ ] No console errors in browser

---

**Date**: November 6, 2025  
**Author**: AI Assistant  
**Branch**: shoar/dedup-data

