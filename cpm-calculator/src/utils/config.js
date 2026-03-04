/**
 * Tab-specific defaults and field configuration for the CPM calculator.
 * All CPM values and ranges sourced from the AdCanvas PRD.
 */

export const TAB_DEFAULTS = {
  display: {
    budget: 250000,
    competitorServingCpm: 1.5,
    competitorProdFee: 0,
    traditionalMediaCpm: 7.5,
    caasCpm: 1.25,
    independentMediaCpm: 5.0,
    padsquadProdFee: 0,
  },
  video: {
    budget: 250000,
    competitorServingCpm: 3.0,
    competitorProdFee: 0,
    traditionalMediaCpm: 25.0,
    caasCpm: 1.25,
    independentMediaCpm: 12.0,
    padsquadProdFee: 0,
  },
}

export const FIELD_CONFIG = {
  budget:               { min: 10000, max: 5000000, step: 10000, label: 'Total Campaign Budget', prefix: '$' },
  competitorServingCpm: { min: 0, max: 15, step: 0.25, label: 'Ad Serving Fee', prefix: '$' },
  competitorProdFee:    { min: 0, max: 100000, step: 500, label: 'Creative Production Fee', prefix: '$' },
  traditionalMediaCpm:  { min: 1, max: 75, step: 0.5, label: 'Media CPM', prefix: '$' },
  caasCpm:              { min: 0.5, max: 5.0, step: 0.25, label: 'CaaS Serving Fee', prefix: '$' },
  independentMediaCpm:  { min: 1, max: 50, step: 0.5, label: 'Independent Media CPM', prefix: '$' },
  padsquadProdFee:      { min: 0, max: 100000, step: 500, label: 'Production Fee', prefix: '$' },
}
