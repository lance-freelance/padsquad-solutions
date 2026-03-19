import { useState, useMemo, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { RATE_CARD } from '../utils/config'
import { formatCpm, formatCurrency, formatCompact } from '../utils/calculations'

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

// Scaled snap values: mantissa × magnitude gives 100K, 125K, 150K … 1B
const IMP_STEPS = (() => {
  const mantissas = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9]
  const out = []
  for (const mag of [1e5, 1e6, 1e7, 1e8]) {
    for (const m of mantissas) {
      const v = Math.round(m * mag)
      if (v <= 1e9) out.push(v)
    }
  }
  out.push(1_000_000_000)
  return [...new Set(out)].sort((a, b) => a - b)
})()

// Ticks align with actual magnitude boundaries on the index scale (each magnitude = 25%)
const IMP_TICKS = ['100K', '1M', '10M', '100M', '1B']

const DEFAULT_IMP_IDX = IMP_STEPS.indexOf(50_000_000)

// Default discount percentages per tier (index matches RATE_CARD.volumeTiers)
const DEFAULT_DISCOUNTS = RATE_CARD.volumeTiers.map((t) => t.discount)

function SliderTicks({ values }) {
  return (
    <div className="flex justify-between mt-1">
      {values.map((v, i) => (
        <span key={i} className="text-[10px] text-[var(--ps-muted)]">{v}</span>
      ))}
    </div>
  )
}

function getActiveTierIdx(totalImpressions) {
  let idx = -1
  RATE_CARD.volumeTiers.forEach((t, i) => {
    if (totalImpressions >= t.threshold) idx = i
  })
  return idx
}

// Derive CPMs from base rates + custom discount percentages
function buildTiers(discounts) {
  return RATE_CARD.volumeTiers.map((t, i) => {
    const d = discounts[i]
    return {
      ...t,
      discount: d,
      displayCpm: Math.round(RATE_CARD.formats.find(f => f.id === 'display').baseCpm * (1 - d) * 100) / 100,
      videoCpm: Math.round(RATE_CARD.formats.find(f => f.type === 'video').baseCpm * (1 - d) * 100) / 100,
    }
  })
}

function getEffectiveCpm(formatId, activeTierIdx, advancedFeatures, tiers) {
  const fmt = RATE_CARD.formats.find((f) => f.id === formatId)
  let cpm = fmt.baseCpm
  if (activeTierIdx >= 0) {
    const tier = tiers[activeTierIdx]
    cpm = fmt.type === 'display' ? tier.displayCpm : tier.videoCpm
  }
  if (advancedFeatures) cpm += RATE_CARD.advancedTechCpm
  return cpm
}

export function CaasCalculator() {
  const [items, setItems] = useState([])
  const [draftFormat, setDraftFormat] = useState('display')
  const [draftIdx, setDraftIdx] = useState(DEFAULT_IMP_IDX)
  const draftImpressions = IMP_STEPS[draftIdx]
  const [exporting, setExporting] = useState(false)
  const planRef = useRef(null)

  // Rate breakdown panel
  const [showRates, setShowRates] = useState(false)
  const [showAdvancedRates, setShowAdvancedRates] = useState(false)
  const [customDiscounts, setCustomDiscounts] = useState(DEFAULT_DISCOUNTS)

  const tiers = useMemo(() => buildTiers(customDiscounts), [customDiscounts])

  const totalImpressions = useMemo(
    () => items.reduce((sum, item) => sum + item.impressions, 0),
    [items]
  )

  const activeTierIdx = useMemo(() => getActiveTierIdx(totalImpressions), [totalImpressions])
  const activeTier = activeTierIdx >= 0 ? tiers[activeTierIdx] : null
  const nextTier = activeTierIdx < tiers.length - 1 ? tiers[activeTierIdx + 1] : null

  const planTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const cpm = getEffectiveCpm(item.format, activeTierIdx, item.advancedFeatures, tiers)
        return sum + (item.impressions / 1000) * cpm
      }, 0),
    [items, activeTierIdx, tiers]
  )

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        format: draftFormat,
        impressions: draftImpressions,
        advancedFeatures: false,
      },
    ])
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function toggleAdvanced(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, advancedFeatures: !item.advancedFeatures } : item
      )
    )
  }

  function setDiscount(idx, value) {
    setCustomDiscounts((prev) => prev.map((d, i) => (i === idx ? value : d)))
  }

  function resetDiscounts() {
    setCustomDiscounts(DEFAULT_DISCOUNTS)
  }

  const handleExportPng = useCallback(async () => {
    if (!planRef.current) return
    setExporting('png')
    try {
      planRef.current.classList.add('ps-exporting')
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      const canvas = await html2canvas(planRef.current, { backgroundColor: '#14133A', scale: 2 })
      planRef.current.classList.remove('ps-exporting')
      const link = document.createElement('a')
      link.download = `AdCanvas_CaaS_Plan_${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      planRef.current?.classList.remove('ps-exporting')
      setExporting(false)
    }
  }, [])

  const handleExportExcel = useCallback(() => {
    const dateStr = new Date().toISOString().slice(0, 10)
    const tierLabel = activeTierIdx >= 0
      ? `${formatCompact(tiers[activeTierIdx].threshold)}+ tier · ${(tiers[activeTierIdx].discount * 100).toFixed(0)}% discount`
      : 'No volume discount (below 200M imps)'
    const avgCpm = totalImpressions > 0
      ? (planTotal / (totalImpressions / 1000)).toFixed(2)
      : '—'

    const ws = XLSX.utils.aoa_to_sheet([
      ['AdCanvas CPM Calculator — Plan Summary'],
      [`Generated: ${dateStr}`],
      [`Volume Tier: ${tierLabel}`],
      [],
      ['Format', 'Impressions', 'CPM ($)', 'Advanced Features', 'CaaS Fee ($)'],
      ...items.map((item) => {
        const fmt = RATE_CARD.formats.find((f) => f.id === item.format)
        const cpm = getEffectiveCpm(item.format, activeTierIdx, item.advancedFeatures, tiers)
        return [fmt.label, item.impressions, cpm, item.advancedFeatures ? 'Yes' : 'No', +((item.impressions / 1000) * cpm).toFixed(2)]
      }),
      [],
      ['PLAN TOTAL', totalImpressions, `Avg CPM: $${avgCpm}`, '', +planTotal.toFixed(2)],
      [],
      ['Powered by PadSquad AdCanvas™', '', '', '', 'padsquad.com'],
    ])
    ws['!cols'] = [{ wch: 26 }, { wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 14 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'CaaS Plan')
    XLSX.writeFile(wb, `AdCanvas_CaaS_Plan_${dateStr}.xlsx`)
  }, [items, totalImpressions, planTotal, activeTierIdx, tiers])

  const toNextTier = nextTier ? nextTier.threshold - totalImpressions : null
  const discountsModified = customDiscounts.some((d, i) => d !== DEFAULT_DISCOUNTS[i])

  return (
    <div className="space-y-4">
      {/* ── Add to plan ───────────────────────────────────────── */}
      <div className="ps-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <select
            value={draftFormat}
            onChange={(e) => setDraftFormat(e.target.value)}
            className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--ps-pink)] transition-colors cursor-pointer"
          >
            {RATE_CARD.formats.map((f) => (
              <option key={f.id} value={f.id} className="bg-[#1a1a2e] text-white">
                {f.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addItem}
            className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[var(--ps-pink)] text-[var(--ps-pink)] hover:bg-[var(--ps-pink)] hover:text-white transition-colors"
          >
            + Add to Plan
          </button>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="ps-label mb-0">Impressions</label>
            <span className="text-2xl font-bold text-white tabular-nums">
              {formatCompact(draftImpressions)}
            </span>
          </div>
          <input
            type="range"
            className="ps-range ps-range--lg"
            value={draftIdx}
            min={0}
            max={IMP_STEPS.length - 1}
            step={1}
            onChange={(e) => setDraftIdx(Number(e.target.value))}
          />
          <SliderTicks values={IMP_TICKS} />
        </div>
      </div>

      {/* ── Plan ─────────────────────────────────────────────── */}
      {items.length > 0 && (
      <div ref={planRef} className="space-y-4">
        {/* Branded header — PNG export only */}
        <div className="ps-export-only items-center gap-3 px-2 pt-2 pb-2">
          <svg width="28" height="26" viewBox="0 0 43 47" fill="none" className="flex-shrink-0">
            <defs>
              <linearGradient id="ps-logo-caas" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#9f6bad" />
                <stop offset="1" stopColor="#ed609d" />
              </linearGradient>
            </defs>
            <path d="M38.17 0H24.75a4.68 4.68 0 0 0-4.68 4.67V42.1a.85.85 0 0 1-.86.86H4.7a.86.86 0 0 1-.85-.85V14.75a.86.86 0 0 1 .85-.85H16.2a1.9 1.9 0 0 0 1.93-1.92v-1.9H4.68A4.68 4.68 0 0 0 0 14.73V42.1a4.68 4.68 0 0 0 4.68 4.68h14.54a4.68 4.68 0 0 0 4.68-4.67V4.68a.86.86 0 0 1 .86-.86h13.42a.86.86 0 0 1 .85.87v26.57a.85.85 0 0 1-.85.84H27.76A1.92 1.92 0 0 0 25.84 34v1.9h12.33a4.68 4.68 0 0 0 4.68-4.65V4.66A4.68 4.68 0 0 0 38.18 0z" fill="url(#ps-logo-caas)" />
          </svg>
          <div>
            <div className="text-sm font-bold text-white tracking-[0.04em]">AdCanvas Plan Summary</div>
            <div className="text-[10px] text-[var(--ps-muted)] tracking-[0.06em]">
              {items.length} format{items.length !== 1 ? 's' : ''} · {formatCurrency(planTotal)} Total CaaS Fee
            </div>
          </div>
        </div>

        <div className="ps-card overflow-hidden ps-reveal">
          {/* Plan header */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between gap-3">
            <span className="text-xs tracking-[0.18em] font-bold text-[var(--ps-muted)] uppercase">
              Plan
            </span>
            <div className="flex items-center gap-2">
              {activeTier && (
                <span className="text-[10px] tracking-[0.06em] text-[var(--ps-purple)] bg-[rgba(159,107,173,0.18)] px-2.5 py-1 rounded-full font-semibold">
                  {formatCompact(activeTier.threshold)}+ · {(activeTier.discount * 100).toFixed(0)}% off
                </span>
              )}
              {toNextTier !== null && (
                <span className="text-[10px] text-[var(--ps-muted)] tracking-[0.04em]">
                  +{formatCompact(toNextTier)} to next tier
                </span>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="border-t border-[var(--ps-divider)]">
            {items.map((item) => {
              const fmt = RATE_CARD.formats.find((f) => f.id === item.format)
              const cpm = getEffectiveCpm(item.format, activeTierIdx, item.advancedFeatures, tiers)
              const total = (item.impressions / 1000) * cpm

              return (
                <div
                  key={item.id}
                  className="px-6 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 flex items-start gap-4"
                >
                  {/* Left: name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">{fmt.label}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={item.advancedFeatures}
                          onChange={() => toggleAdvanced(item.id)}
                          className="w-3 h-3 cursor-pointer accent-[#ed609d]"
                        />
                        <span className="text-[10px] text-[var(--ps-muted)] select-none">
                          Adv. Features
                        </span>
                      </label>
                      <span className="text-[var(--ps-divider)] select-none">·</span>
                      <span className="text-[10px] tabular-nums text-[var(--ps-muted)]">
                        {formatCpm(cpm)} CPM
                      </span>
                    </div>
                  </div>

                  {/* Right: impressions + total — fixed widths keep columns aligned */}
                  <div className="flex items-start gap-4 shrink-0">
                    <div className="w-14 text-right">
                      <div className="text-base font-bold text-white tabular-nums leading-tight">
                        {formatCompact(item.impressions)}
                      </div>
                      <div className="text-[9px] tracking-[0.1em] uppercase text-[var(--ps-muted)] mt-0.5">
                        Imps
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <div className="text-base font-bold text-[var(--ps-pink)] tabular-nums leading-tight">
                        {formatCurrency(total)}
                      </div>
                      <div className="text-[9px] tracking-[0.1em] uppercase text-[var(--ps-muted)] mt-0.5">
                        CaaS Fee
                      </div>
                    </div>
                    <div className="w-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove"
                        className="text-[var(--ps-muted)] hover:text-[var(--ps-pink)] transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Plan total — impressions + avg CPM (dollar total is in the summary card below) */}
          <div className="px-6 py-4 border-t border-[var(--ps-divider)] flex items-center gap-4">
            <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ps-muted)]">
              Plan Total
            </span>
            <div className="w-14 text-right">
              <div className="text-base font-bold text-white tabular-nums leading-tight">
                {formatCompact(totalImpressions)}
              </div>
              <div className="text-[9px] tracking-[0.1em] uppercase text-[var(--ps-muted)] mt-0.5">
                Imps
              </div>
            </div>
            <div className="w-20 text-right">
              <div className="text-base font-bold text-white tabular-nums leading-tight">
                {totalImpressions > 0 ? formatCpm(planTotal / (totalImpressions / 1000)) : '—'}
              </div>
              <div className="text-[9px] tracking-[0.1em] uppercase text-[var(--ps-muted)] mt-0.5">
                Avg CPM
              </div>
            </div>
            <div className="w-4" />{/* spacer matches trash button column */}
          </div>
        </div>

        {/* ── Investment summary ──────────────────────────────── */}
        <div className="ps-card overflow-hidden ps-reveal">
          <div className="px-6 pt-5 pb-3">
            <div className="text-xs tracking-[0.18em] font-semibold text-[var(--ps-pink)] uppercase">
              Your AdCanvas Investment
            </div>
          </div>
          <div className="px-6 pb-6 space-y-3">
            {items.map((item) => {
              const fmt = RATE_CARD.formats.find((f) => f.id === item.format)
              const cpm = getEffectiveCpm(item.format, activeTierIdx, item.advancedFeatures, tiers)
              const total = (item.impressions / 1000) * cpm
              return (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--ps-textSoft)] truncate">
                    {fmt.label}
                    {item.advancedFeatures && (
                      <span className="ml-1.5 text-[10px] text-[var(--ps-muted)]">+ Adv.</span>
                    )}
                  </span>
                  <div className="flex items-center gap-4 shrink-0 tabular-nums">
                    <span className="text-sm text-[var(--ps-muted)]">
                      {formatCompact(item.impressions)} imps
                    </span>
                    <span className="text-sm font-semibold text-white w-20 text-right">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              )
            })}
            <div className="border-t border-[var(--ps-divider)] pt-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ps-muted)]">
                Total Client Commitment
              </span>
              <span className="text-xl font-bold text-[var(--ps-pink)] tabular-nums">
                {formatCurrency(planTotal)}
              </span>
            </div>
            <p className="text-[10px] text-[var(--ps-muted)] tracking-[0.04em]">
              Media buy is managed independently at standard programmatic rates.
            </p>
          </div>
        </div>
        {/* Branded footer — PNG export only */}
        <div className="ps-export-only justify-center py-3">
          <span className="text-[10px] text-[var(--ps-muted)] tracking-[0.1em] uppercase">
            Powered by PadSquad AdCanvas™
          </span>
        </div>
      </div>
      )}

      {/* Empty hint */}
      {items.length === 0 && (
        <p className="text-center text-[var(--ps-muted)] text-xs py-6 tracking-[0.04em]">
          Select a format above and add it to your plan.
        </p>
      )}

      {/* ── Rate Breakdown ────────────────────────────────────── */}
      <div className="ps-card overflow-hidden">
        <button
          type="button"
          onClick={() => { setShowRates((p) => !p); if (showRates) setShowAdvancedRates(false) }}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <span className="text-xs tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase flex items-center gap-2">
            Rate Breakdown
            {discountsModified && (
              <span className="text-[9px] text-[var(--ps-purple)] bg-[rgba(159,107,173,0.18)] px-1.5 py-0.5 rounded-full tracking-[0.04em] font-semibold">
                CUSTOM
              </span>
            )}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 16 16" fill="none"
            className={`text-[var(--ps-muted)] transition-transform ${showRates ? 'rotate-180' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showRates && (
          <div className="border-t border-[var(--ps-divider)]">
            {/* Table header */}
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <div className="grid grid-cols-[100px_60px_60px_60px] gap-3 flex-1 text-[10px] tracking-[0.1em] font-semibold text-[var(--ps-muted)] uppercase">
                <span>Volume</span>
                <span className="text-right">Discount</span>
                <span className="text-right">Display</span>
                <span className="text-right">Video</span>
              </div>
              <div className="flex items-center gap-3 ml-4">
                {discountsModified && (
                  <button
                    type="button"
                    onClick={resetDiscounts}
                    className="text-[10px] text-[var(--ps-muted)] hover:text-[var(--ps-pink)] transition-colors tracking-[0.06em] uppercase"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAdvancedRates((p) => !p)}
                  className={`text-[10px] tracking-[0.08em] uppercase transition-colors ${
                    showAdvancedRates
                      ? 'text-[var(--ps-purple)]'
                      : 'text-[var(--ps-muted)] hover:text-[var(--ps-pink)]'
                  }`}
                >
                  {showAdvancedRates ? '← Lock' : 'Advanced'}
                </button>
              </div>
            </div>

            {/* Base row */}
            <div className="px-6 py-2.5 border-b border-[rgba(255,255,255,0.04)]">
              <div className="grid grid-cols-[100px_60px_60px_60px] gap-3 text-xs text-[var(--ps-textSoft)]">
                <span>Base</span>
                <span className="text-right tabular-nums">—</span>
                <span className="text-right tabular-nums">{formatCpm(1.35)}</span>
                <span className="text-right tabular-nums">{formatCpm(1.60)}</span>
              </div>
            </div>

            {/* Tier rows */}
            {tiers.map((tier, i) => {
              const isActive = i === activeTierIdx
              return (
                <div
                  key={i}
                  className={`px-6 border-b border-[rgba(255,255,255,0.04)] last:border-0 ${
                    showAdvancedRates ? 'py-3' : 'py-2.5'
                  } ${isActive ? 'bg-[rgba(159,107,173,0.07)]' : ''}`}
                >
                  <div className={`grid grid-cols-[100px_60px_60px_60px] gap-3 text-xs items-center ${
                    isActive ? 'text-white' : 'text-[var(--ps-textSoft)]'
                  }`}>
                    <span className={isActive ? 'font-semibold' : ''}>
                      {formatCompact(tier.threshold)}+
                      {isActive && (
                        <span className="ml-1.5 text-[9px] text-[var(--ps-purple)] bg-[rgba(159,107,173,0.2)] px-1.5 py-0.5 rounded-full">
                          ON
                        </span>
                      )}
                    </span>
                    <span className={`text-right tabular-nums ${isActive ? 'text-[var(--ps-purple)] font-bold' : ''}`}>
                      {(tier.discount * 100).toFixed(0)}%
                    </span>
                    <span className="text-right tabular-nums">{formatCpm(tier.displayCpm)}</span>
                    <span className="text-right tabular-nums">{formatCpm(tier.videoCpm)}</span>
                  </div>

                  {showAdvancedRates && (
                    <div className="mt-2.5 flex items-center gap-3">
                      <span className="text-[10px] text-[var(--ps-muted)] w-[100px] shrink-0">
                        Discount
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={0.30}
                        step={0.01}
                        value={customDiscounts[i]}
                        onChange={(e) => setDiscount(i, Number(e.target.value))}
                        className="ps-range ps-range--purple flex-1"
                      />
                      <span className="text-[10px] text-[var(--ps-purple)] tabular-nums w-8 text-right font-semibold">
                        {(customDiscounts[i] * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

            <div className="px-6 py-3">
              <p className="text-[9px] text-[var(--ps-muted)] tracking-[0.04em]">
                Tiers evaluated quarterly. Advanced Features add +$0.15 CPM per format.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Export footer ─────────────────────────────────────── */}
      {items.length > 0 && (
        <div className="ps-footer-bar ps-reveal">
          <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase">
            AdCanvas Plan Summary Download
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleExportExcel} className="ps-btn ps-btn--primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Excel
            </button>
            <button type="button" onClick={handleExportPng} disabled={exporting === 'png'} className="ps-btn ps-btn--primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exporting === 'png' ? 'Exporting…' : 'Download PNG'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaasCalculator
