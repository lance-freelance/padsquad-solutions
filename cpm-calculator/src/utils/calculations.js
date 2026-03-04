/**
 * CPM Efficiency Calculator — pure calculation functions.
 *
 * Configurable constants live here so product can tweak CaaS / production
 * fee assumptions without touching component code.
 */

export const CAAS_CPM = 2.50;
export const DEFAULT_PRODUCTION_FEE = 0;

/**
 * Core efficiency calculation.
 *
 * @param {number} budget            Total campaign budget ($)
 * @param {number} currentAllInCpm   Traditional all-in CPM ($)
 * @param {number} independentCpm    Independent / open-market media CPM ($)
 * @param {object} [opts]
 * @param {number} [opts.caasCpm]          CaaS serving fee as a CPM ($/1K imps)
 * @param {number} [opts.productionFee]    Flat production fee ($)
 * @returns {object}
 */
export function calculateEfficiency(
  budget,
  currentAllInCpm,
  independentCpm,
  { caasCpm = CAAS_CPM, productionFee = DEFAULT_PRODUCTION_FEE } = {}
) {
  if (!budget || !currentAllInCpm || !independentCpm) {
    return null;
  }

  const traditionalImpressions = (budget / currentAllInCpm) * 1000;
  const efficientImpressions = (budget / independentCpm) * 1000;
  const additionalImpressions = Math.max(0, efficientImpressions - traditionalImpressions);
  const reachMultiplier = traditionalImpressions > 0
    ? efficientImpressions / traditionalImpressions
    : 0;
  const dollarValueOfEfficiency = (additionalImpressions / 1000) * independentCpm;

  const caasServingFee = (efficientImpressions / 1000) * caasCpm;
  const totalClientCommitment = caasServingFee + productionFee;

  return {
    traditionalImpressions,
    efficientImpressions,
    additionalImpressions,
    reachMultiplier,
    dollarValueOfEfficiency,
    caasServingFee,
    productionFee,
    totalClientCommitment,
  };
}

export function formatNumber(n) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatCurrency(n) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function formatMultiplier(n) {
  if (n == null || isNaN(n)) return '—';
  return n.toFixed(2) + 'x';
}
