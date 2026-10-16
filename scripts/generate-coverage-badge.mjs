#!/usr/bin/env node
/**
 * Generate a shields-style coverage SVG from Vitest or coverage.py JSON.
 *
 * Usage:
 *   node scripts/generate-coverage-badge.mjs \
 *     --label vitest \
 *     --summary coverage/coverage-summary.json \
 *     --out badges/coverage-vitest.svg
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const args = {
    label: 'coverage',
    summary: join(root, 'coverage', 'coverage-summary.json'),
    out: join(root, 'badges', 'coverage.svg'),
    threshold: 80,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === '--label') args.label = value;
    else if (key === '--summary') args.summary = value.startsWith('/') ? value : join(root, value);
    else if (key === '--out') args.out = value.startsWith('/') ? value : join(root, value);
    else if (key === '--threshold') args.threshold = Number(value);
    else continue;
    i += 1;
  }
  return args;
}

function percentFromSummary(summary) {
  if (summary?.total?.lines?.pct != null) {
    return Number(summary.total.lines.pct);
  }
  if (summary?.totals?.percent_covered != null) {
    return Number(summary.totals.percent_covered);
  }
  throw new Error('Unrecognized coverage summary format');
}

function formatPct(pct) {
  const rounded = Math.round(pct * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function badgeColor(pct, threshold) {
  if (pct >= threshold) return '#4c1';
  if (pct >= threshold - 20) return '#dfb317';
  return '#e05d44';
}

function renderSvg(label, valueText, color) {
  const labelWidth = Math.max(54, 6 * label.length + 20);
  const valueWidth = 54;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${valueText}">
  <title>${label}: ${valueText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="${(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}">${label}</text>
    <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}">${label}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueWidth - 10) * 10}">${valueText}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)" textLength="${(valueWidth - 10) * 10}">${valueText}</text>
  </g>
</svg>
`;
}

const args = parseArgs(process.argv);
const summary = JSON.parse(readFileSync(args.summary, 'utf8'));
const pct = percentFromSummary(summary);
const valueText = `${formatPct(pct)}%`;
const svg = renderSvg(args.label, valueText, badgeColor(pct, args.threshold));

mkdirSync(dirname(args.out), { recursive: true });
writeFileSync(args.out, svg, 'utf8');
console.log(`Wrote ${args.out} (${args.label}: ${valueText})`);
