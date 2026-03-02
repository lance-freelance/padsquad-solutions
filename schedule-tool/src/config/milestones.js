/**
 * Milestone configs: BD = business days from kick-off.
 * Two paths: PadSquad design vs client design (toggle in UI).
 */

/** @type {{ label: string, bdOffset: number }[]} */
export const PADSQUAD_DESIGN_MILESTONES = [
  { label: 'Project kick-off', bdOffset: 0 },
  { label: 'Creative brief approved', bdOffset: 2 },
  { label: 'Concept direction', bdOffset: 5 },
  { label: 'First concepts', bdOffset: 7 },
  { label: 'Internal review', bdOffset: 9 },
  { label: 'Client review 1', bdOffset: 11 },
  { label: 'Revisions', bdOffset: 13 },
  { label: 'Client review 2', bdOffset: 15 },
  { label: 'Final revisions', bdOffset: 17 },
  { label: 'Final approval', bdOffset: 19 },
  { label: 'Production start', bdOffset: 21 },
  { label: 'Asset production', bdOffset: 23 },
  { label: 'QA', bdOffset: 25 },
  { label: 'Go-live prep', bdOffset: 27 },
  { label: 'Campaign launch', bdOffset: 28 },
]

/** @type {{ label: string, bdOffset: number }[]} */
export const CLIENT_DESIGN_MILESTONES = [
  { label: 'Project kick-off', bdOffset: 0 },
  { label: 'Specs to client', bdOffset: 1 },
  { label: 'Client concepts due', bdOffset: 5 },
  { label: 'PadSquad review', bdOffset: 7 },
  { label: 'Feedback to client', bdOffset: 9 },
  { label: 'Client revision 1', bdOffset: 12 },
  { label: 'Client revision 2', bdOffset: 15 },
  { label: 'Final assets due', bdOffset: 18 },
  { label: 'Asset intake', bdOffset: 19 },
  { label: 'Trafficking start', bdOffset: 21 },
  { label: 'Ad build & QA', bdOffset: 24 },
  { label: 'Final review', bdOffset: 26 },
  { label: 'Go-live prep', bdOffset: 27 },
  { label: 'Campaign launch', bdOffset: 28 },
]
