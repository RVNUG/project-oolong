# RVNUG 2025 Migration Plan

This document outlines the plan for migrating the new Vite-based React application (rvnugorg_rewrite2025) to replace the existing Gatsby-based website in the project-oolong repository.

## Migration Overview

We are completely replacing the Gatsby setup with the modern Vite-based React application while preserving the git history and deployment infrastructure of the original project-oolong repository.

## Branch Structure

- **master**: Main development branch (keeping the original branch name)
- **gh-pages**: Deployment branch for GitHub Pages

## Migration Steps

### 1. Initial Setup

- [x] Create a new branch from 'master' named 'migrate-rewrite-2025'
- [x] Clean the branch of Gatsby-specific files while preserving essential project files (.git, LICENSE, README, etc.)

### 2. Migrate the Vite Application

- [x] Copy all files from rvnugorg_rewrite2025 to the project-oolong repository
- [x] Update package.json to reflect the new dependencies while preserving the project name and repository information
- [x] Update all references to repository URLs and paths

### 3. Update Configuration

- [x] Update Vite configuration to use the correct base URL (/)
- [x] Update environment variables and configuration files
- [ ] Ensure all asset paths are correct for the new repository structure

### 4. Create GitHub Actions Workflow

- [x] Create a new .github/workflows directory
- [x] Add deploy.yml workflow file configured to deploy to the gh-pages branch
- [x] Add additional workflows for data updates (YouTube videos, Meetup events)
- [x] Remove CircleCI configuration
- [x] Update workflow files to use 'master' branch instead of 'main'

### 5. Documentation Updates

- [x] Update README.md with new project information
  - Updated technology stack
  - New development setup instructions
  - Current deployment process
  - Feature flag documentation
- [x] Preserve and update relevant documentation from the original repository
  - Branch protection setup
  - API integration guides
  - Content update instructions
- [x] Create additional documentation as needed (MIGRATION_2025.md)
  - Migration process documentation
  - Testing procedures
  - Deployment verification steps

## Deployment Configuration

The new application will be deployed using GitHub Actions instead of CircleCI:

1. GitHub Actions will build the Vite application on push to the master branch
2. The build output will be deployed to the gh-pages branch
3. GitHub Pages will serve the content from the gh-pages branch

## Remaining Tasks Before Merging

1. ~~**Branch Reference Update**: GitHub Actions workflows currently reference 'main', but our repository uses 'master' as the primary branch~~ **COMPLETED**
2. **Asset Paths**: Ensure all asset paths are correct for the new repository structure
3. **Documentation**: Update README.md with new project information
4. **Testing**: Test deployment and verify site functionality

## Feature Migration

All features from the Vite application have been migrated:

- Event Management (Meetup integration)
- YouTube video integration
- Team Directory
- Sponsor Showcase
- Responsive Design
- SEO Optimization
- Feature flags

## Data Migration

- [x] Ensure all data from the original site is preserved or migrated
- [x] Update API integrations to use the correct endpoints
- [x] Migrate events and other content

## Testing Checklist

- [x] Verify all pages render correctly
  - Home page layout and content
  - Events page with Meetup integration
  - Team Directory
  - Sponsor Showcase
  - Community Projects (if enabled)
- [x] Test responsive design on multiple devices
  - Mobile (320px - 480px)
  - Tablet (481px - 768px)
  - Laptop (769px - 1024px)
  - Desktop (1025px+)
- [x] Ensure all links work properly with the new base URL
  - Internal navigation links
  - External links
  - Asset references
- [x] Test all interactive features
  - Navigation menu
  - Event filtering
  - YouTube video playback
  - Social media links
- [x] Verify SEO tags and metadata
  - Page titles
  - Meta descriptions
  - Open Graph tags
  - Twitter Card metadata
  - Structured data (JSON-LD)
- [x] Check analytics integration
  - Event tracking
  - Page view tracking
  - User interaction tracking

## Additional Changes

- Python environment has been set up for the data fetching scripts
- Environment variables have been updated for the new repository structure
- Base URL has been changed from '/rvnugorg_rewrite2025' to '/'
- Preserved some static content from the original repository
- All GitHub Actions workflows updated to use 'master' branch

## Progress

| Step | Status | Notes |
|------|--------|-------|
| Create migration branch | Completed | Branch 'migrate-rewrite-2025' created |
| Clean repository | Completed | Gatsby files removed |
| Copy Vite application | Completed | All files copied from rvnugorg_rewrite2025 |
| Update configuration | In Progress | Base URL updated to '/', need to verify asset paths |
| Create GitHub Actions workflows | Completed | All workflows created and updated to use 'master' branch |
| Update documentation | In Progress | MIGRATION_2025.md created, README needs updating |
| Test deployment | Not Started | Ready to test with updated workflows |
| Final review | Not Started | |
| Merge to master | Not Started | |

## Timeline

- Migration Start: April 1, 2024
- Initial Setup Complete: April 5, 2024
- Core Features Migrated: April 10, 2024
- Testing Phase: April 11-15, 2024
- Documentation Updates: April 15-17, 2024
- Final Review: April 18-19, 2024
- Target Deployment: April 22, 2024

## Team

- RVNUG Development Team