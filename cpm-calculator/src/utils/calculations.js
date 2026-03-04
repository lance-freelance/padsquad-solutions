/**
 * CPM Efficiency Calculator — pure calculation functions.
 *
 * PRD calculation model:
 *   Traditional: All-In CPM = Serving Fee + Media CPM
 *                Impressions = (Budget - ProdFee) / AllInCPM × 1000
 *   PadSquad:    All-In CPM = CaaS Fee + Independent Media CPM
 *                Impressions = Budget / AllInCPM × 1000
 */

export const CAAS_CPM = 1.25

/**
 * @param {object} inputs
 * @returns {object|null}
 */
export function calculateEfficiency({
  budget,
  competitorServingCpm,
  competitorProdFee,
  traditionalMediaCpm,
  caasCpm,
  independentMediaCpm,
  padsquadProdFee,
}) {
  const b = Number(budget) || 0
  const servFee = Number(competitorServingCpm) || 0
  const compProd = Number(competitorProdFee) || 0
  const tradMedia = Number(traditionalMediaCpm) || 0
  const caas = Number(caasCpm) || CAAS_CPM
  const indMedia = Number(independentMediaCpm) || 0
  const psProd = Number(padsquadProdFee) || 0

  if (b <= 0) return null

  // Traditional
  const traditionalAllInCpm = servFee + tradMedia
  const traditionalWorkingBudget = Math.max(0, b - compProd)
  const traditionalImpressions =
    traditionalAllInCpm > 0 ? (traditionalWorkingBudget / traditionalAllInCpm) * 1000 : 0

  // PadSquad
  const padsquadAllInCpm = caas + indMedia
  const padsquadImpressions =
    padsquadAllInCpm > 0 ? (b / padsquadAllInCpm) * 1000 : 0

  // Delta
  const incrementalImpressions = Math.max(0, padsquadImpressions - traditionalImpressions)
  const reachMultiplier =
    traditionalImpressions > 0 ? padsquadImpressions / traditionalImpressions : 0
  const valueUnlocked = (incrementalImpressions / 1000) * padsquadAllInCpm

  // Investment summary
  const caasServingFee = (padsquadImpressions / 1000) * caas
  const totalClientCommitment = caasServingFee + psProd

  return {
    traditionalAllInCpm,
    padsquadAllInCpm,
    traditionalImpressions,
    padsquadImpressions,
    incrementalImpressions,
    reachMultiplier,
    valueUnlocked,
    caasServingFee,
    padsquadProdFee: psProd,
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
