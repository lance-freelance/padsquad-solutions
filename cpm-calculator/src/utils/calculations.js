/**
 * CPM Efficiency Calculator — pure calculation functions.
 *
 * Simplified model (single vendor CPM):
 *   Traditional:  Impressions = Budget / VendorCPM × 1000
 *   PadSquad:     Impressions = Budget / (CaaS + ProgECPM) × 1000
 *   Value:        Incremental / 1000 × PadSquadAllInCPM
 *
 * eCPM is clamped to never exceed vendor CPM.
 */

export function calculateEfficiency({ budget, vendorCpm, caasCpm, programmaticEcpm }) {
  const b = Number(budget) || 0
  const vendor = Number(vendorCpm) || 0
  const caas = Number(caasCpm) || 0
  // eCPM can never exceed vendor rate — you wouldn't buy more expensive media
  const progEcpm = Math.min(Number(programmaticEcpm) || 0, vendor)

  if (b <= 0 || vendor <= 0) return null

  // Traditional — single all-in CPM
  const traditionalImpressions = (b / vendor) * 1000

  // PadSquad — CaaS + programmatic media
  const padsquadAllInCpm = caas + progEcpm
  const padsquadImpressions = padsquadAllInCpm > 0 ? (b / padsquadAllInCpm) * 1000 : 0

  // Delta
  const incrementalImpressions = Math.max(0, padsquadImpressions - traditionalImpressions)
  const reachMultiplier =
    traditionalImpressions > 0 ? padsquadImpressions / traditionalImpressions : 0
  // Value unlocked uses full all-in CPM (matches pricing sheet: 12.2M / 1000 × $6.25 = $76,388.89)
  const valueUnlocked = (incrementalImpressions / 1000) * padsquadAllInCpm

  // CPM savings (the root cause of all incremental value)
  const cpmSavings = vendor - padsquadAllInCpm

  // Investment breakdown
  const caasServingFee = (padsquadImpressions / 1000) * caas
  const totalClientCommitment = caasServingFee

  return {
    vendorCpm: vendor,
    padsquadAllInCpm,
    cpmSavings,
    traditionalImpressions,
    padsquadImpressions,
    incrementalImpressions,
    reachMultiplier,
    valueUnlocked,
    caasServingFee,
    totalClientCommitment,
  }
}

export function formatNumber(n) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function formatCurrency(n) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatMultiplier(n) {
  if (n == null || isNaN(n)) return '—'
  return n.toFixed(2) + 'x'
}

export function formatCpm(n) {
  if (n == null || isNaN(n)) return '—'
  return '$' + Number(n).toFixed(2)
}

/**
 * CaaS Rate Card Calculator — given format + impressions + add-ons, returns cost breakdown.
 */
export function calculateCaas({ format, impressions, advancedTech }, rateCard) {
  const fmt = rateCard.formats.find((f) => f.id === format)
  if (!fmt || !impressions || impressions <= 0) return null

  const baseCpm = fmt.baseCpm
  const isDisplay = fmt.type === 'display'

  // Find highest applicable volume tier
  let activeTierIdx = -1
  rateCard.volumeTiers.forEach((t, i) => {
    if (impressions >= t.threshold) activeTierIdx = i
  })

  let effectiveCpm = baseCpm
  let discountPct = 0
  let tierLabel = null
  if (activeTierIdx >= 0) {
    const tier = rateCard.volumeTiers[activeTierIdx]
    effectiveCpm = isDisplay ? tier.displayCpm : tier.videoCpm
    discountPct = tier.discount
    tierLabel = formatCompact(tier.threshold) + '+ tier'
  }

  const addonCpm = advancedTech ? rateCard.advancedTechCpm : 0
  const yourCpm = effectiveCpm + addonCpm
  const totalCost = (impressions / 1000) * yourCpm

  return { baseCpm, discountPct, effectiveCpm, addonCpm, yourCpm, totalCost, tierLabel, activeTierIdx }
}

export function formatCompact(n) {
  if (n == null || isNaN(n)) return '—'
  if (n >= 1e9) return parseFloat((n / 1e9).toFixed(2)) + 'B'
  if (n >= 1e6) return parseFloat((n / 1e6).toFixed(2)) + 'M'
  if (n >= 1e3) return Math.round(n / 1e3) + 'K'
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}
