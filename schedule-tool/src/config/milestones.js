/**
 * Milestone configs: BD = business days from kick-off.
 * Three paths:
 *   - padSquad: PadSquad handles full creative design
 *   - client:   Client provides their own design
 *   - assetProduction: Client assets already in hand, PadSquad does layout → dev → QA
 *
 * isClientAction: true marks steps that are client-owned gates —
 * the schedule slips if the client misses these dates.
 */

/** @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]} */
export const PADSQUAD_DESIGN_MILESTONES = [
  { label: 'Project kick-off',   bdOffset: 0 },
  { label: 'Creative brief approved', bdOffset: 2 },
  { label: 'Concept direction',  bdOffset: 5 },
  { label: 'First concepts',     bdOffset: 7 },
  { label: 'Internal review',    bdOffset: 9 },
  { label: 'Client review 1',    bdOffset: 11, isClientAction: true },
  { label: 'Revisions',          bdOffset: 13 },
  { label: 'Client review 2',    bdOffset: 15, isClientAction: true },
  { label: 'Final revisions',    bdOffset: 17 },
  { label: 'Final approval',     bdOffset: 19, isClientAction: true },
  { label: 'Production start',   bdOffset: 21 },
  { label: 'Asset production',   bdOffset: 23 },
  { label: 'QA',                 bdOffset: 25 },
  { label: 'Go-live prep',       bdOffset: 27 },
  { label: 'Campaign launch',    bdOffset: 28 },
]

/** @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]} */
export const CLIENT_DESIGN_MILESTONES = [
  { label: 'Project kick-off',    bdOffset: 0 },
  { label: 'Specs to client',     bdOffset: 1 },
  { label: 'Client concepts due', bdOffset: 5,  isClientAction: true },
  { label: 'PadSquad review',     bdOffset: 7 },
  { label: 'Feedback to client',  bdOffset: 9 },
  { label: 'Client revision 1',   bdOffset: 12, isClientAction: true },
  { label: 'Client revision 2',   bdOffset: 15, isClientAction: true },
  { label: 'Final assets due',    bdOffset: 18, isClientAction: true },
  { label: 'Asset intake',        bdOffset: 19 },
  { label: 'Trafficking start',   bdOffset: 21 },
  { label: 'Ad build & QA',       bdOffset: 24 },
  { label: 'Final review',        bdOffset: 26 },
  { label: 'Go-live prep',        bdOffset: 27 },
  { label: 'Campaign launch',     bdOffset: 28 },
]

/**
 * Asset-in-hand production workflow.
 * Client has already provided finished assets; PadSquad handles
 * layout review → development → demo review → QA → launch.
 * Total: 12 business days.
 *
 * @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export const ASSET_PRODUCTION_MILESTONES = [
  { label: 'PadSquad receives assets',             bdOffset: 0 },
  { label: 'Creative layout deck sent for review', bdOffset: 2 },
  { label: 'Client provides feedback',             bdOffset: 3,  isClientAction: true },
  { label: 'Revised layout deck sent',             bdOffset: 4 },
  { label: 'Client approves creative layout',      bdOffset: 5,  isClientAction: true },
  { label: 'Development phase starts',             bdOffset: 6 },
  { label: 'Creative demo links sent for review',  bdOffset: 7 },
  { label: 'Client feedback on demo links',        bdOffset: 8,  isClientAction: true },
  { label: 'Revised demo links sent',              bdOffset: 9 },
  { label: 'Client approves demo links',           bdOffset: 10, isClientAction: true },
  { label: 'QA & trafficking setup',               bdOffset: 11 },
  { label: 'Campaign launch',                      bdOffset: 12 },
]
