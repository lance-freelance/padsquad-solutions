/**
 * Milestone config builder — all BDs measured from kick-off (BD 0).
 *
 * Two axes: design ownership × asset readiness → 4 workflows.
 *
 * buildMilestones(config) accepts a declarative config and computes
 * { label, bdOffset, isClientAction } entries dynamically.
 *
 * Parameters:
 *   creativeDays — duration of the creative build phase (default: 1 BD)
 *   demoDays     — duration of the demo build phase (default: 1 BD)
 *   smartCommerce — when true, adds 7 BD lead time before the anchor milestone
 */

// Default day values
export const DEFAULT_CREATIVE_DAYS = 1
export const DEFAULT_DEMO_DAYS = 1
export const AD_COMMERCE_DEMO_DAYS = 5
export const SMART_COMMERCE_LEAD_DAYS = 7

/**
 * Build a milestone array from a declarative phase config.
 *
 * @param {object} config
 * @param {Array<{ label: string, offset: number|function, isClientAction?: boolean }>} config.phases
 *   Each phase entry defines a milestone. `offset` is either a static number or
 *   a function (ctx) => number where ctx holds running computed values.
 * @param {{ creativeDays?: number, demoDays?: number }} config.params
 * @returns {{ label: string, bdOffset: number, isClientAction?: boolean }[]}
 */
export function buildMilestones({ phases, params = {} }) {
  const ctx = { ...params }

  return phases.map((phase) => {
    const bdOffset = typeof phase.offset === 'function'
      ? phase.offset(ctx)
      : phase.offset

    const entry = { label: phase.label, bdOffset }
    if (phase.isClientAction) entry.isClientAction = true
    return entry
  })
}

// ─── Phase definitions ───────────────────────────────────────────────
// Each workflow defines its phases as offset functions that reference
// creativeDays (cd), demoDays (dd), and smartLead (sl) from context.

/**
 * PadSquad designs — client answers "No" to "Will you provide the design?"
 * Has both a creative development phase and a demo development phase.
 */
export function getPadSquadDesignMilestones(creativeDays = DEFAULT_CREATIVE_DAYS, demoDays = DEFAULT_DEMO_DAYS) {
  const cd = (ctx) => ctx.creativeDays ?? creativeDays
  const dd = (ctx) => ctx.demoDays ?? demoDays

  return buildMilestones({
    params: { creativeDays, demoDays },
    phases: [
      { label: 'Assets received',               offset: 0 },
      { label: 'Creative development',          offset: (ctx) => cd(ctx) },
      { label: 'Creative review R1',            offset: (ctx) => cd(ctx) + 1,  isClientAction: true },
      { label: 'Creative feedback due',         offset: (ctx) => cd(ctx) + 2,  isClientAction: true },
      { label: 'Creative feedback implemented', offset: (ctx) => cd(ctx) + 3 },
      { label: 'Creative review R2',            offset: (ctx) => cd(ctx) + 6,  isClientAction: true },
      { label: 'Creative approval',             offset: (ctx) => cd(ctx) + 7,  isClientAction: true },
      { label: 'Demo development',              offset: (ctx) => cd(ctx) + 9 },
      { label: 'Demo review R1',                offset: (ctx) => cd(ctx) + 9 + dd(ctx),     isClientAction: true },
      { label: 'Demo feedback due',             offset: (ctx) => cd(ctx) + 9 + dd(ctx) + 4, isClientAction: true },
      { label: 'Demo feedback implemented',     offset: (ctx) => cd(ctx) + 9 + dd(ctx) + 5 },
      { label: 'Demo review R2',                offset: (ctx) => cd(ctx) + 9 + dd(ctx) + 6, isClientAction: true },
      { label: 'Client approval',               offset: (ctx) => cd(ctx) + 9 + dd(ctx) + 7, isClientAction: true },
      { label: 'QA & trafficking',              offset: (ctx) => cd(ctx) + 9 + dd(ctx) + 9 },
      { label: 'Campaign launch',               offset: (ctx) => cd(ctx) + 9 + dd(ctx) + 10 },
    ],
  })
}

/**
 * Client provides design — client answers "Yes" to "Will you provide the design?"
 * Client delivers pre-approved design files; PadSquad builds demos only.
 */
export function getClientDesignMilestones(demoDays = DEFAULT_DEMO_DAYS) {
  const dd = (ctx) => ctx.demoDays ?? demoDays

  return buildMilestones({
    params: { demoDays },
    phases: [
      { label: 'Design files received',      offset: 0 },
      { label: 'Demo development',           offset: 2 },
      { label: 'Demo review R1',             offset: (ctx) => 2 + dd(ctx),      isClientAction: true },
      { label: 'Demo feedback due',          offset: (ctx) => 2 + dd(ctx) + 4,  isClientAction: true },
      { label: 'Demo feedback implemented',  offset: (ctx) => 2 + dd(ctx) + 5 },
      { label: 'Demo review R2',             offset: (ctx) => 2 + dd(ctx) + 6,  isClientAction: true },
      { label: 'Client approval',            offset: (ctx) => 2 + dd(ctx) + 7,  isClientAction: true },
      { label: 'QA & trafficking',           offset: (ctx) => 2 + dd(ctx) + 9 },
      { label: 'Campaign launch',            offset: (ctx) => 2 + dd(ctx) + 10 },
    ],
  })
}

/**
 * PadSquad designs + assets in hand.
 * Assets received; PadSquad creates creative layout before building demos.
 * Expedited: 1 creative review round instead of 2.
 */
export function getPadSquadAssetsMilestones(demoDays = DEFAULT_DEMO_DAYS) {
  const dd = (ctx) => ctx.demoDays ?? demoDays

  return buildMilestones({
    params: { demoDays },
    phases: [
      { label: 'Assets received',              offset: 0 },
      { label: 'Creative layout sent',         offset: 2 },
      { label: 'Creative feedback due',        offset: 3,                          isClientAction: true },
      { label: 'Creative revisions sent',      offset: 4 },
      { label: 'Creative approval',            offset: 5,                          isClientAction: true },
      { label: 'Demo development',             offset: 6 },
      { label: 'Demo review R1',               offset: (ctx) => 6 + dd(ctx),     isClientAction: true },
      { label: 'Demo feedback due',            offset: (ctx) => 6 + dd(ctx) + 1, isClientAction: true },
      { label: 'Demo feedback implemented',    offset: (ctx) => 6 + dd(ctx) + 2 },
      { label: 'Client approval',              offset: (ctx) => 6 + dd(ctx) + 3, isClientAction: true },
      { label: 'QA & trafficking',             offset: (ctx) => 6 + dd(ctx) + 4 },
      { label: 'Campaign launch',              offset: (ctx) => 6 + dd(ctx) + 5 },
    ],
  })
}

/**
 * Client provides design + assets in hand.
 * Design files and assets received; PadSquad jumps straight to demo development.
 * Expedited: 1 demo review round, no R2.
 */
export function getClientAssetsMilestones(demoDays = DEFAULT_DEMO_DAYS) {
  const dd = (ctx) => ctx.demoDays ?? demoDays

  return buildMilestones({
    params: { demoDays },
    phases: [
      { label: 'Design files & assets received', offset: 0 },
      { label: 'Demo development',               offset: 1 },
      { label: 'Demo review R1',                 offset: (ctx) => 1 + dd(ctx),     isClientAction: true },
      { label: 'Demo feedback due',              offset: (ctx) => 1 + dd(ctx) + 1, isClientAction: true },
      { label: 'Demo feedback implemented',      offset: (ctx) => 1 + dd(ctx) + 2 },
      { label: 'Client approval',                offset: (ctx) => 1 + dd(ctx) + 3, isClientAction: true },
      { label: 'QA & trafficking',               offset: (ctx) => 1 + dd(ctx) + 5 },
      { label: 'Campaign launch',                offset: (ctx) => 1 + dd(ctx) + 6 },
    ],
  })
}
