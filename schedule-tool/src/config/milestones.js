/**
 * Milestone configs — all BDs measured from kick-off (BD 0).
 *
 * Two axes: design ownership × asset readiness → 4 workflows.
 *
 * Toggle "Client provided design?"
 *   No  → PadSquad creates the creative.
 *   Yes → Client supplies an already-approved design.
 *
 * Checkbox "Assets received by PadSquad"
 *   Unchecked → standard timelines.
 *   Checked   → expedited timelines (assets in hand, fewer review rounds).
 *
 *   No  + No assets  → PADSQUAD_DESIGN_MILESTONES       21 BDs
 *   No  + Assets     → PADSQUAD_ASSETS_MILESTONES       12 BDs
 *   Yes + No assets  → CLIENT_DESIGN_MILESTONES         13 BDs
 *   Yes + Assets     → CLIENT_ASSETS_MILESTONES          8 BDs
 *
 * isClientAction: true = client-owned gate; the schedule slips if missed.
 */

/**
 * PadSquad designs — client answers "No" to "Will you provide the design?"
 * 21 BDs, 15 steps.
 * @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export const PADSQUAD_DESIGN_MILESTONES = [
  { label: 'Assets received',               bdOffset: 0  },
  { label: 'Creative development',          bdOffset: 1  },
  { label: 'Creative review R1',            bdOffset: 2,  isClientAction: true },
  { label: 'Creative feedback due',         bdOffset: 3,  isClientAction: true },
  { label: 'Creative feedback implemented', bdOffset: 4  },
  { label: 'Creative review R2',            bdOffset: 7,  isClientAction: true },
  { label: 'Creative approval',             bdOffset: 8,  isClientAction: true },
  { label: 'Demo development',              bdOffset: 10 },
  { label: 'Demo review R1',                bdOffset: 11, isClientAction: true },
  { label: 'Demo feedback due',             bdOffset: 15, isClientAction: true },
  { label: 'Demo feedback implemented',     bdOffset: 16 },
  { label: 'Demo review R2',                bdOffset: 17, isClientAction: true },
  { label: 'Client approval',               bdOffset: 18, isClientAction: true },
  { label: 'QA & trafficking',              bdOffset: 20 },
  { label: 'Campaign launch',               bdOffset: 21 },
]

/**
 * Client provides design — client answers "Yes" to "Will you provide the design?"
 * Client delivers pre-approved design files; PadSquad builds demos only.
 * 13 BDs, 9 steps.
 * @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export const CLIENT_DESIGN_MILESTONES = [
  { label: 'Design files received',      bdOffset: 0  },
  { label: 'Demo development',           bdOffset: 2  },
  { label: 'Demo review R1',             bdOffset: 3,  isClientAction: true },
  { label: 'Demo feedback due',          bdOffset: 7,  isClientAction: true },
  { label: 'Demo feedback implemented',  bdOffset: 8  },
  { label: 'Demo review R2',             bdOffset: 9,  isClientAction: true },
  { label: 'Client approval',            bdOffset: 10, isClientAction: true },
  { label: 'QA & trafficking',           bdOffset: 12 },
  { label: 'Campaign launch',            bdOffset: 13 },
]

/**
 * PadSquad designs + assets in hand.
 * Assets received; PadSquad creates creative layout for review before
 * building demos. Expedited: 1 creative review round instead of 2.
 * 12 BDs, 12 steps.
 * @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export const PADSQUAD_ASSETS_MILESTONES = [
  { label: 'Assets received',              bdOffset: 0  },
  { label: 'Creative layout sent',         bdOffset: 2  },
  { label: 'Creative feedback due',        bdOffset: 3,  isClientAction: true },
  { label: 'Creative revisions sent',      bdOffset: 4  },
  { label: 'Creative approval',            bdOffset: 5,  isClientAction: true },
  { label: 'Demo development',             bdOffset: 6  },
  { label: 'Demo review R1',               bdOffset: 7,  isClientAction: true },
  { label: 'Demo feedback due',            bdOffset: 8,  isClientAction: true },
  { label: 'Demo feedback implemented',    bdOffset: 9  },
  { label: 'Client approval',              bdOffset: 10, isClientAction: true },
  { label: 'QA & trafficking',             bdOffset: 11 },
  { label: 'Campaign launch',              bdOffset: 12 },
]

/**
 * Client provides design + assets in hand.
 * Design files and assets received; PadSquad jumps straight to demo
 * development. Expedited: 1 demo review round, no R2.
 * 8 BDs, 8 steps.
 * @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export const CLIENT_ASSETS_MILESTONES = [
  { label: 'Design files & assets received', bdOffset: 0  },
  { label: 'Demo development',               bdOffset: 1  },
  { label: 'Demo review R1',                 bdOffset: 2,  isClientAction: true },
  { label: 'Demo feedback due',              bdOffset: 3,  isClientAction: true },
  { label: 'Demo feedback implemented',      bdOffset: 4  },
  { label: 'Client approval',                bdOffset: 5,  isClientAction: true },
  { label: 'QA & trafficking',               bdOffset: 7  },
  { label: 'Campaign launch',                bdOffset: 8  },
]
