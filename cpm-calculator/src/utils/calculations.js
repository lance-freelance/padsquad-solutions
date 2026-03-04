/**
 * CPM Efficiency Calculator — pure calculation functions.
 *
 * Simplified model (single vendor CPM):
 *   Traditional:  Impressions = Budget / VendorCPM × 1000
 *   PadSquad:     Impressions = Budget / (CaaS + ProgECPM) × 1000
 *   Value:        Incremental / 1000 × PadSquadAllInCPM
 */

export function calculateEfficiency({ budget, vendorCpm, caasCpm, programmaticEcpm }) {
  const b = Number(budget) || 0
  const vendor = Number(vendorCpm) || 0
  const caas = Number(caasCpm) || 0
  const progEcpm = Number(programmaticEcpm) || 0

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

  // Investment breakdown
  const caasServingFee = (padsquadImpressions / 1000) * caas
  const totalClientCommitment = caasServingFee

  return {
    vendorCpm: vendor,
    padsquadAllInCpm,
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

export function formatCompact(n) {
  if (n == null || isNaN(n)) return '—'
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}
