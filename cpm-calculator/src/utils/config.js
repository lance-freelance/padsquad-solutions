/**
 * Tab-specific defaults and field configuration for the CPM calculator.
 * Values sourced from the AdCanvas pricing sheet.
 *
 * Video CaaS fee is $2.00 (display is $1.25).
 */

export const TAB_DEFAULTS = {
  display: {
    budget: 250000,
    vendorCpm: 9,
    caasCpm: 1.25,
    programmaticEcpm: 5.0,
  },
  video: {
    budget: 250000,
    vendorCpm: 28,
    caasCpm: 2.0,
    programmaticEcpm: 12.0,
  },
}

export const FIELD_CONFIG = {
  budget:           { min: 25000, max: 2000000, step: 25000, label: 'Total Campaign Budget' },
  vendorCpm:        { min: 5, max: 30, step: 0.5, label: 'High-Impact Vendor CPM' },
  caasCpm:          { min: 0.5, max: 5.0, step: 0.25, label: 'AdCanvas CaaS Fee' },
  programmaticEcpm: { min: 1, max: 25, step: 0.5, label: 'Programmatic Media eCPM' },
}
