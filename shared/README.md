# PadSquad Solutions — Shared Design System

Single source of truth for look and feel across PadSquad Solutions tools: **schedule-tool**, **CPM Calculator**, and **Ad Experience Planner**.

## File

- **`design-system.css`** — Design tokens (Part A) and optional component classes (Part B, `ps-ds-*`). Import this file first in your app’s main CSS entry (e.g. before Tailwind).

## How to consume

### From an app in the same parent folder (e.g. `local-code/`)

If your app lives next to `shared/` (e.g. `schedule-tool/`, `cpm calculator/`):

1. In your main CSS file (e.g. `src/index.css`), add:
   ```css
   @import '../../shared/design-system.css';
   ```
   (Adjust the relative path so it goes from your app’s CSS file up to the parent and into `shared/`.)

2. Load this CSS before Tailwind (or other base/styles) so variables are available.

3. Optionally extend Tailwind with the same tokens, e.g. in `tailwind.config.js`:
   ```js
   theme: {
     extend: {
       colors: {
         navy: 'var(--color-navy)',
         pink: 'var(--color-pink)',
         teal: 'var(--color-teal)',
         gray: 'var(--color-gray)',
         'purple-primary': 'var(--color-purple-primary)',
         'purple-accent': 'var(--color-purple-accent)',
         surface: 'var(--color-surface)',
         panel: 'var(--color-panel)',
       },
     },
   },
   ```

### CPM Calculator

When you build or move the CPM Calculator into this repo structure:

1. Add a main CSS file that imports the design system:
   ```css
   @import '../../shared/design-system.css';
   ```
2. Use tokens (`var(--color-*)`) and, if useful, `ps-ds-*` component classes.
3. Use **navy** as the primary dark (same as schedule-tool) unless you want a distinct theme.

### Ad Experience Planner (future)

For the Experience Planner UI (light canvas, purple column headers, white cards):

1. Import `design-system.css` first.
2. Set **light** canvas: `background: var(--color-bg)` on the page.
3. Use **purple** for headers/panels: set `--color-panel: var(--color-purple-primary)` at the root of the Planner app (or use `var(--color-purple-primary)` directly where needed).
4. Use **white** cards: `background: var(--color-surface)`, `border: 1px solid var(--color-border)`.
5. Use **accent purple** for labels/active states: `var(--color-accent-purple)` or `var(--color-purple-accent)`.
6. Use the optional **`ps-ds-*`** components for tabs, list cards, buttons, panel headers, status bar so the Planner matches the reference design.

## When to use navy vs purple

- **Navy** (`--color-navy`, `--color-bg-dark`, `--color-panel` default): Use for **schedule-tool** and **CPM Calculator** — dark background, navy headers, pink/teal accents.
- **Purple** (`--color-purple-primary`, `--color-purple-accent`): Use for **Ad Experience Planner** — light page background, dark purple column headers and icon blocks, accent purple for “DISPLAY”-style labels and active tab.
- The design system defines **both** so each app can choose. Override `--color-panel` in the Planner to `var(--color-purple-primary)` if you want `ps-ds-panel-header` and `ps-ds-icon-block` to be purple there.

## Token naming

- **Brand:** `--color-navy`, `--color-pink`, `--color-teal`, `--color-gray`, `--color-purple-primary`, `--color-purple-accent`.
- **Semantic:** `--color-bg`, `--color-bg-dark`, `--color-surface`, `--color-surface-dark`, `--color-panel`, `--color-border`, `--color-border-dark`, `--color-text`, `--color-text-muted`, `--color-text-inverse`, `--color-text-soft`, `--color-accent`, `--color-accent-secondary`, `--color-accent-purple`.
- **Typography:** `--font-sans`, `--text-xs` … `--text-2xl`, `--font-medium` / `--font-semibold` / `--font-bold`, `--letter-spacing-*`.
- **Spacing / radius / shadow:** `--space-1` … `--space-12`, `--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-card` / `--radius-full`, `--shadow-sm` / `--shadow-md` / `--shadow-card`.

## Optional component classes (`ps-ds-*`)

If you use Part B of `design-system.css`:

| Class | Use |
|-------|-----|
| `.ps-ds-btn`, `.ps-ds-btn--primary`, `.ps-ds-btn--secondary` | Buttons (pill shape) |
| `.ps-ds-card` | Card/surface with border and radius |
| `.ps-ds-panel-header` | Column/panel header (dark bg, white text) |
| `.ps-ds-tabs`, `.ps-ds-tab`, `.ps-ds-tab--active` | Circular tab row (e.g. Ad Type) |
| `.ps-ds-list-card`, `.ps-ds-list-card__icon`, `__body`, `__title`, `__desc`, `__actions` | List row with icon, title, description, actions |
| `.ps-ds-icon-block` | Square icon on panel color |
| `.ps-ds-status-bar`, `.ps-ds-status-bar__actions` | Footer status line with optional action icons |

All components use design-system tokens only, so they stay consistent across apps.
