# CI unit tests, 80% coverage gate, and README badge

**Date:** 2026-10-16  
**Status:** Approved

## Problem

PR CI runs build, TypeScript, and ESLint but not unit tests. Coverage exists locally via Vitest (`npm run test:coverage`) at roughly 80%, but there is no CI gate and no README coverage badge.

## Goals

1. Run unit tests with coverage on every PR commit (pull_request opened/synchronize/reopened).
2. Fail the PR check if coverage is below **80%** for lines, functions, and statements (branches gated at **70%** to match current coverage and prevent regression).
3. Show the resulting coverage percentage as a badge on `README.md`, updated from `master` without third-party coverage services.

## Non-goals

- Codecov, Coveralls, or other external coverage hosts
- Unit tests for `meetup-proxy/`
- Playwright / E2E in this gate

## Approach

Self-contained GitHub Actions with a committed SVG badge on `master`.

### PR gate

- Extend `.github/workflows/pr-checks.yml` with a `unit-tests` job:
  - Node 22, `npm ci --legacy-peer-deps`, `npm run test:coverage`
  - No `.env` required for unit tests
- Wire `unit-tests` into the existing `status-check` aggregator
- Update workflow display name to mention tests

### Coverage threshold

- Configure Vitest coverage `thresholds` in `vitest.config.ts`: 80% lines/functions/statements, 70% branches
- Add `json-summary` reporter so CI can read `coverage/coverage-summary.json`
- Local and CI share the same gate

### Badge on master

- New workflow `.github/workflows/coverage-badge.yml` on push to `master` (and `workflow_dispatch`):
  - Run `npm run test:coverage`
  - Generate `badges/coverage.svg` from total line coverage in `coverage-summary.json`
  - Color: green ≥80, yellow ≥60, red otherwise
  - Commit only when the SVG changed; commit message includes `[skip ci]`
  - Permissions: `contents: write`
- Seed initial `badges/coverage.svg` so the README image is valid before the first master run
- README: `![Coverage](badges/coverage.svg)` near the top

## Error handling

- Failed tests or coverage below threshold → `unit-tests` job fails → `status-check` fails
- Badge workflow failure does not block PRs; it only affects badge freshness on `master`
- `[skip ci]` prevents recursive CI from badge commits

## Testing / verification

- Locally: `npm run test:coverage` exits non-zero if under 80%
- PR workflow YAML includes `unit-tests` and status-check dependency
- Badge script produces valid SVG from a sample `coverage-summary.json`
