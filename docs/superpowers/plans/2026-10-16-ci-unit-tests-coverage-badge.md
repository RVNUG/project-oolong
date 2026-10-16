# CI Unit Tests + Coverage Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run Vitest unit tests with an 80% coverage gate on PRs and publish a self-updating coverage SVG badge on the README from `master`.

**Architecture:** Extend `pr-checks.yml` with a `unit-tests` job; configure Vitest thresholds + `json-summary`; add a `master`-only workflow that regenerates `badges/coverage.svg` via a small Node script and commits with `[skip ci]`.

**Tech Stack:** GitHub Actions, Vitest 4 + `@vitest/coverage-v8`, npm, committed SVG badge

## Global Constraints

- Coverage threshold: 80% lines/functions/statements; 70% branches (current floor)
- No Codecov/Coveralls; badge is committed SVG under `badges/`
- Default branch: `master`
- Node 22; `npm ci --legacy-peer-deps` (match existing workflows)
- Do not commit unless the user explicitly asks

---

### Task 1: Vitest coverage thresholds and json-summary

**Files:**
- Modify: `vitest.config.ts`

- [ ] **Step 1:** Add `json-summary` to coverage reporters and `thresholds` at 80 for lines, functions, statements, branches
- [ ] **Step 2:** Run `npm run test:coverage` and confirm it passes (or fix excludes only if a metric is falsely failing on known excluded SW glue)

### Task 2: Badge generator script + seed SVG

**Files:**
- Create: `scripts/generate-coverage-badge.mjs`
- Create: `badges/coverage.svg`

- [ ] **Step 1:** Script reads `coverage/coverage-summary.json`, writes `badges/coverage.svg` with total line `%` and color bands (≥80 green, ≥60 yellow, else red)
- [ ] **Step 2:** Run coverage then script to seed the SVG

### Task 3: PR checks — unit-tests job

**Files:**
- Modify: `.github/workflows/pr-checks.yml`

- [ ] **Step 1:** Add `unit-tests` job (checkout, setup-node 22 + npm cache, `npm ci --legacy-peer-deps`, `npm run test:coverage`)
- [ ] **Step 2:** Add `unit-tests` to `status-check` `needs` and failure condition
- [ ] **Step 3:** Update workflow `name` to mention tests

### Task 4: Coverage badge workflow on master

**Files:**
- Create: `.github/workflows/coverage-badge.yml`

- [ ] **Step 1:** On `push` to `master` and `workflow_dispatch`: install, `test:coverage`, run badge script, commit `badges/coverage.svg` if changed with `[skip ci]`

### Task 5: README badge

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Add `![Coverage](badges/coverage.svg)` near the top of the README
