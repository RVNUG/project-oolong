# Design system

The FigCraft design kit, Light/Dark tokens, export previews, and generator scripts live in a **sibling repository**:

**[RVNUG/rvnug-design-system](https://github.com/RVNUG/rvnug-design-system)**

This website (`project-oolong`) remains the **implementation**: CSS variables and component styles under `src/assets/css/` (especially [`theme.css`](../src/assets/css/theme.css)).

## How the repos relate

| Repo | Role |
|------|------|
| `rvnug-design-system` | Source of truth for FigCraft file, `tokens/rvnug.variables.json`, PNG exports |
| `project-oolong` | Runtime UI (React + CSS) for rvnug.org |

There is no git submodule. Edit design in the design-system repo; implement or reconcile tokens here in CSS. A future sync script between `rvnug.variables.json` and `theme.css` is optional.

## Local clone layout

```text
Repos/RVNUG/
  project-oolong/          # this repo
  rvnug-design-system/     # sibling clone
```

Open the FigCraft file from the design-system repo (see its README for `--control` / automation-root flags).
