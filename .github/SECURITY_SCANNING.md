# Security scanning (ephemeral CI)

Project-Oolong uses free, open-source scanners that run on GitHub-hosted runners. There is no dedicated Semgrep/Opengrep/Sonar server and no GitHub CodeQL / Code Quality dependency in this repository.

## What runs

Workflow: [`.github/workflows/security.yml`](../workflows/security.yml)

| Scanner | Role | Gate |
| --- | --- | --- |
| **Semgrep CE** (pinned Docker tag in `security.yml`) | SAST for TypeScript, React, JavaScript, Python | Fails on ERROR findings |
| **Gitleaks** (pinned Docker tag in `security.yml`) | Secret scanning | Fails on any finding |
| **Trivy** (SHA-pinned `trivy-action` + pinned Trivy CLI `version:`) | Dependency / filesystem vulns | Fails on HIGH/CRITICAL |

The required status check name is **`security`** (aggregator job). PR quality also uses **`Status Check`** from [`pr-checks.yml`](../workflows/pr-checks.yml).

### Keeping pins current (no floating `:latest`)

Versions stay **pinned** for supply-chain safety. Updates arrive as reviewed PRs:

| Updater | Owns |
| --- | --- |
| **Renovate** ([`renovate.json`](../../renovate.json)) | GitHub Actions (digest-pinned) + Semgrep / Gitleaks / Trivy pins in `security.yml` |
| **Dependabot** ([`dependabot.yml`](../dependabot.yml)) | npm (root + `meetup-proxy`) |

Renovate is configured with `ignoreUnstable` / `respectLatest` so it targets stable releases, not prereleases. Install the [Renovate GitHub App](https://github.com/apps/renovate) on this repo (or the RVNUG org) after merge — config alone does nothing until the app is enabled.

Prefer Dependabot **alerts** (free on public repos) plus Trivy CI gates instead of GitHub Code Scanning.

## Why not CodeQL / Code Quality

- [GitHub Code Quality](https://github.blog/changelog/2026-06-16-github-code-quality-generally-available-july-20-2026/) became a paid product (GA July 20, 2026).
- CodeQL analysis also consumes Actions minutes when enabled.
- This repo intentionally uses ephemeral OSS alternatives instead.

## Manual repo settings (after merge)

1. **Install [Renovate](https://github.com/apps/renovate)** on this repo/org so scanner and Actions pin bumps open as PRs.
2. **Disable Code Scanning / Code Quality** (if enabled) under the org or repo Security settings so you are not billed or charged Actions minutes for unused GitHub products.
3. **Branch protection / ruleset** on the default branch: require status checks `Status Check` and `security`.
4. Keep **Dependabot alerts** enabled (npm updates still come from Dependabot).

## Local smoke tests (optional)

```bash
# Semgrep CE (Docker)
docker run --rm -v "$PWD:/src" semgrep/semgrep:1.179.0 semgrep scan \
  --config p/typescript --config p/react --config p/javascript --config p/python \
  --error --metrics=off /src

# Gitleaks
docker run --rm -v "$PWD:/repo:ro" ghcr.io/gitleaks/gitleaks:v8.30.1 \
  detect --source=/repo --verbose --redact
```

## Client-side env caution

Vite embeds `VITE_*` values in the browser bundle. The contact form uses a narrowly scoped `VITE_GITHUB_DISPATCH_TOKEN` that is intentionally public (see README). Do not put other secrets in `VITE_*` variables.

See also: [Actions docs](https://docs.github.com/en/actions), [Pull requests docs](https://docs.github.com/en/pull-requests).
