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
- [ ] Update all references to repository URLs and paths

### 3. Update Configuration

- [ ] Update Vite configuration to use the correct base URL (/project-oolong)
- [ ] Update environment variables and configuration files
- [ ] Ensure all asset paths are correct for the new repository structure

### 4. Create GitHub Actions Workflow

- [x] Create a new .github/workflows directory
- [x] Add deploy.yml workflow file configured to deploy to the gh-pages branch
- [x] Add additional workflows for data updates (YouTube videos, Meetup events)
- [ ] Remove CircleCI configuration

### 5. Documentation Updates

- [ ] Update README.md with new project information
- [ ] Preserve and update relevant documentation from the original repository
- [ ] Create additional documentation as needed

## Deployment Configuration

The new application will be deployed using GitHub Actions instead of CircleCI:

1. GitHub Actions will build the Vite application on push to the master branch
2. The build output will be deployed to the gh-pages branch
3. GitHub Pages will serve the content from the gh-pages branch

## Feature Migration

All features from the Vite application will be migrated:

- Event Management (Meetup integration)
- YouTube video integration
- Team Directory
- Sponsor Showcase
- Responsive Design
- SEO Optimization
- Feature flags

## Data Migration

- [ ] Ensure all data from the original site is preserved or migrated
- [ ] Update API integrations to use the correct endpoints
- [ ] Migrate events and other content

## Testing Checklist

- [ ] Verify all pages render correctly
- [ ] Test responsive design on multiple devices
- [ ] Ensure all links work properly with the new base URL
- [ ] Test all interactive features
- [ ] Verify SEO tags and metadata
- [ ] Check analytics integration

## Additional Changes

Document any additional changes or improvements made during the migration process here.

## Progress

| Step | Status | Notes |
|------|--------|-------|
| Create migration branch | Not Started | |
| Clean repository | Not Started | |
| Copy Vite application | Not Started | |
| Update configuration | Not Started | |
| Create GitHub Actions workflows | Not Started | |
| Update documentation | Not Started | |
| Test deployment | Not Started | |
| Final review | Not Started | |
| Merge to master | Not Started | |

## Timeline

- Migration Start: [DATE]
- Target Completion: [DATE]

## Team

- [List team members involved in the migration]