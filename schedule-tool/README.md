# Campaign Timelines & Schedule Tool

Client-facing planning tool that generates day-by-day production schedules for PadSquad digital advertising campaigns. Part of the solutions.padsquad.com tool suite.

## Stack

- React 18, Vite, Tailwind CSS
- react-day-picker, date-fns
- @react-pdf/renderer, html2canvas

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deploy

Configured for Netlify (`netlify.toml`). SPA redirects ensure client-side routing works when embedded via iFrame in HubSpot.

## Features

- **Date input**: Kick-off date or go-live date (toggle).
- **Design toggle**: PadSquad design vs client design (two milestone/asset configs).
- **Timeline**: 15 milestones with computed dates (business days, holiday-aware).
- **Asset checklist**: Deliverables list per design path.
- **Export**: PDF (branded) and PNG (1600×900, timeline section).

Design tokens and optional components live in the shared PadSquad design system: `../shared/design-system.css` (see that folder’s README). This app imports it and uses navy, pink, teal, gray; the same file is used by CPM Calculator and Ad Experience Planner.
