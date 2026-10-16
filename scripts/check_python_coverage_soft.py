#!/usr/bin/env python3
"""Soft coverage gate for pytest: warn (exit 0) when under threshold."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    summary_path = Path(sys.argv[1] if len(sys.argv) > 1 else "coverage-python/coverage.json")
    threshold = float(sys.argv[2] if len(sys.argv) > 2 else 80)

    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    pct = float(summary["totals"]["percent_covered"])
    display = round(pct, 1)

    if pct < threshold:
        print(
            f"::warning::Python coverage is {display}% (soft threshold {threshold}%). "
            "Pytest tests passed; improve coverage when practical.",
            file=sys.stderr,
        )
        return 0

    print(f"Python coverage {display}% meets soft threshold {threshold}%.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
