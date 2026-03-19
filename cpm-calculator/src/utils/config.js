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
  vendorCpm:        { min: 5, max: 30, step: 0.5, label: 'Legacy Vendor CPM (Media + Creative)' },
  caasCpm:          { min: 0.5, max: 5.0, step: 0.25, label: 'AdCanvas CaaS Fee' },
  programmaticEcpm: { min: 1, max: 25, step: 0.5, label: 'Programmatic Media eCPM' },
}

// CaaS Rate Card — sourced from AdCanvas pricing sheet
export const RATE_CARD = {
  formats: [
    { id: 'display',   label: 'Rich Media - Display',   baseCpm: 1.35, type: 'display' },
    { id: 'outstream', label: 'Rich Media - Outstream',  baseCpm: 1.60, type: 'video' },
    { id: 'olv',       label: 'OLV - VidStream',         baseCpm: 1.60, type: 'video' },
    { id: 'vidstream', label: 'OLV - VidStream+',        baseCpm: 1.60, type: 'video' },
    { id: 'ctv',       label: 'CTV - VidStream',         baseCpm: 1.60, type: 'video' },
  ],
  advancedTechCpm: 0.15,
  // Tiers are ascending — apply the highest qualifying threshold
  volumeTiers: [
    { threshold: 200_000_000,   discount: 0.05, displayCpm: 1.28, videoCpm: 1.52 },
    { threshold: 400_000_000,   discount: 0.07, displayCpm: 1.26, videoCpm: 1.49 },
    { threshold: 600_000_000,   discount: 0.10, displayCpm: 1.22, videoCpm: 1.44 },
    { threshold: 800_000_000,   discount: 0.13, displayCpm: 1.17, videoCpm: 1.39 },
    { threshold: 1_000_000_000, discount: 0.16, displayCpm: 1.13, videoCpm: 1.34 },
  ],
}

export const CAAS_DEFAULTS = {
  format: 'display',
  impressions: 50_000_000,
  advancedTech: false,
}

export const IMP_SLIDER = {
  min: 100_000,
  max: 1_000_000_000,
  step: 100_000,
}
