/**
 * Milestone config factories — all BDs measured from kick-off (BD 0).
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
 * creativeDays — editable duration of the creative build phase (default: 1 BD)
 *   Applies only to PadSquad design + no assets (the only workflow with a full
 *   creative development step).
 *
 * demoDays — editable duration of the demo build phase (default: 1 BD)
 *   Applies to all four workflows. Increase for interactive / game / Ad Commerce
 *   builds that require more development time.
 *
 * isClientAction: true = client-owned gate; the schedule slips if missed.
 */

/**
 * PadSquad designs — client answers "No" to "Will you provide the design?"
 * Has both a creative development phase and a demo development phase.
 */
export function getPadSquadDesignMilestones(creativeDays = 1, demoDays = 1) {
  const cd = creativeDays
  const dd = demoDays
  return [
    { label: 'Assets received',               bdOffset: 0 },
    { label: 'Creative development',          bdOffset: cd },
    { label: 'Creative review R1',            bdOffset: cd + 1,      isClientAction: true },
    { label: 'Creative feedback due',         bdOffset: cd + 2,      isClientAction: true },
    { label: 'Creative feedback implemented', bdOffset: cd + 3 },
    { label: 'Creative review R2',            bdOffset: cd + 6,      isClientAction: true },
    { label: 'Creative approval',             bdOffset: cd + 7,      isClientAction: true },
    { label: 'Demo development',              bdOffset: cd + 9 },
    { label: 'Demo review R1',                bdOffset: cd + 9 + dd,     isClientAction: true },
    { label: 'Demo feedback due',             bdOffset: cd + 9 + dd + 4, isClientAction: true },
    { label: 'Demo feedback implemented',     bdOffset: cd + 9 + dd + 5 },
    { label: 'Demo review R2',                bdOffset: cd + 9 + dd + 6, isClientAction: true },
    { label: 'Client approval',               bdOffset: cd + 9 + dd + 7, isClientAction: true },
    { label: 'QA & trafficking',              bdOffset: cd + 9 + dd + 9 },
    { label: 'Campaign launch',               bdOffset: cd + 9 + dd + 10 },
  ]
}

/**
 * Client provides design — client answers "Yes" to "Will you provide the design?"
 * Client delivers pre-approved design files; PadSquad builds demos only.
 */
export function getClientDesignMilestones(demoDays = 1) {
  const dd = demoDays
  return [
    { label: 'Design files received',      bdOffset: 0 },
    { label: 'Demo development',           bdOffset: 2 },
    { label: 'Demo review R1',             bdOffset: 2 + dd,      isClientAction: true },
    { label: 'Demo feedback due',          bdOffset: 2 + dd + 4,  isClientAction: true },
    { label: 'Demo feedback implemented',  bdOffset: 2 + dd + 5 },
    { label: 'Demo review R2',             bdOffset: 2 + dd + 6,  isClientAction: true },
    { label: 'Client approval',            bdOffset: 2 + dd + 7,  isClientAction: true },
    { label: 'QA & trafficking',           bdOffset: 2 + dd + 9 },
    { label: 'Campaign launch',            bdOffset: 2 + dd + 10 },
  ]
}

/**
 * PadSquad designs + assets in hand.
 * Assets received; PadSquad creates creative layout before building demos.
 * Expedited: 1 creative review round instead of 2.
 */
export function getPadSquadAssetsMilestones(demoDays = 1) {
  const dd = demoDays
  return [
    { label: 'Assets received',              bdOffset: 0 },
    { label: 'Creative layout sent',         bdOffset: 2 },
    { label: 'Creative feedback due',        bdOffset: 3,      isClientAction: true },
    { label: 'Creative revisions sent',      bdOffset: 4 },
    { label: 'Creative approval',            bdOffset: 5,      isClientAction: true },
    { label: 'Demo development',             bdOffset: 6 },
    { label: 'Demo review R1',               bdOffset: 6 + dd,     isClientAction: true },
    { label: 'Demo feedback due',            bdOffset: 6 + dd + 1, isClientAction: true },
    { label: 'Demo feedback implemented',    bdOffset: 6 + dd + 2 },
    { label: 'Client approval',              bdOffset: 6 + dd + 3, isClientAction: true },
    { label: 'QA & trafficking',             bdOffset: 6 + dd + 4 },
    { label: 'Campaign launch',              bdOffset: 6 + dd + 5 },
  ]
}

/**
 * Client provides design + assets in hand.
 * Design files and assets received; PadSquad jumps straight to demo development.
 * Expedited: 1 demo review round, no R2.
 */
export function getClientAssetsMilestones(demoDays = 1) {
  const dd = demoDays
  return [
    { label: 'Design files & assets received', bdOffset: 0 },
    { label: 'Demo development',               bdOffset: 1 },
    { label: 'Demo review R1',                 bdOffset: 1 + dd,     isClientAction: true },
    { label: 'Demo feedback due',              bdOffset: 1 + dd + 1, isClientAction: true },
    { label: 'Demo feedback implemented',      bdOffset: 1 + dd + 2 },
    { label: 'Client approval',                bdOffset: 1 + dd + 3, isClientAction: true },
    { label: 'QA & trafficking',               bdOffset: 1 + dd + 5 },
    { label: 'Campaign launch',                bdOffset: 1 + dd + 6 },
  ]
}

// Default day values
export const DEFAULT_CREATIVE_DAYS = 1
export const DEFAULT_DEMO_DAYS = 1
export const AD_COMMERCE_DEMO_DAYS = 5
