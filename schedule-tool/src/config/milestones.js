/**
 * Milestone configs — all BDs measured from kick-off (BD 0).
 *
 * Toggle "Will you provide the design?"
 *   No  → PADSQUAD_DESIGN_MILESTONES  — PadSquad creates the creative from scratch.
 *          21 BDs: assets → creative dev → 2× creative review →
 *                  demo dev → 2× demo review → QA → launch.
 *
 *   Yes → CLIENT_DESIGN_MILESTONES    — Client supplies an already-approved design.
 *          13 BDs: design files → demo dev → 2× demo review → QA → launch.
 *
 * Separate "Assets ready?" toggle (overrides both above):
 *        → ASSET_PRODUCTION_MILESTONES — Production-ready assets in hand;
 *                                        PadSquad reviews layout before building demos.
 *          12 BDs: assets → layout review → demo dev → demo review → QA → launch.
 *
 * isClientAction: true = client-owned gate; the schedule slips if missed.
 *
 * Naming conventions (consistent across all three):
 *   Creative phase  — 'Creative {event}'   (PadSquad design path only)
 *   Layout phase    — 'Layout {event}'     (Asset production path only)
 *   Demo phase      — 'Demo {event}'       (all three paths)
 *   Client actions  — always isClientAction: true
 *   Final approval  — 'Client approval'    (all three paths, final step before QA)
 *   Shared anchors  — 'Demo development', 'QA & trafficking', 'Campaign launch'
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
 * Assets in hand — triggered by the separate "Assets ready?" toggle.
 * Production-ready assets received; PadSquad creates a layout deck for
 * client review before building demos.
 * 12 BDs, 12 steps.
 * @type {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export const ASSET_PRODUCTION_MILESTONES = [
  { label: 'Assets received',           bdOffset: 0  },
  { label: 'Layout deck sent',          bdOffset: 2  },
  { label: 'Layout feedback due',       bdOffset: 3,  isClientAction: true },
  { label: 'Revised layout sent',       bdOffset: 4  },
  { label: 'Layout approved',           bdOffset: 5,  isClientAction: true },
  { label: 'Demo development',          bdOffset: 6  },
  { label: 'Demo review R1',            bdOffset: 7,  isClientAction: true },
  { label: 'Demo feedback due',         bdOffset: 8,  isClientAction: true },
  { label: 'Demo feedback implemented', bdOffset: 9  },
  { label: 'Client approval',           bdOffset: 10, isClientAction: true },
  { label: 'QA & trafficking',          bdOffset: 11 },
  { label: 'Campaign launch',           bdOffset: 12 },
]
