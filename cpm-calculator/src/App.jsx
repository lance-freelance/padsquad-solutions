import { useState, useRef, useMemo, useCallback } from 'react'
import { CalculatorForm } from './components/CalculatorForm'
import { EfficiencyResults } from './components/EfficiencyResults'
import { EcpmTuner } from './components/EcpmTuner'
import { InvestmentSummary } from './components/InvestmentSummary'
import { ResultsExport } from './components/ResultsExport'
import { calculateEfficiency, formatCurrency } from './utils/calculations'
import { TAB_DEFAULTS } from './utils/config'

const TABS = [
  { id: 'display', label: 'Display / Rich Media' },
  { id: 'video', label: 'Video' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('display')
  const [formValues, setFormValues] = useState({
    display: { ...TAB_DEFAULTS.display },
    video: { ...TAB_DEFAULTS.video },
  })
  const [revealed, setRevealed] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const resultsRef = useRef(null)
  const revealRef = useRef(null)

  const values = formValues[activeTab]
  const tabLabel = activeTab === 'video' ? 'Video' : 'Display / Rich Media'

  const handleChange = useCallback((field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }))
  }, [activeTab])

  const handleReveal = useCallback(() => {
    setRevealed(true)
    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  const results = useMemo(() => {
    return calculateEfficiency(values)
  }, [values])

  return (
    <div className="min-h-screen bg-[var(--ps-bg)]">
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <svg width="36" height="34" viewBox="0 0 43 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PadSquad" className="flex-shrink-0">
              <defs>
                <linearGradient id="ps-logo-grad" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox">
                  <stop offset="0" stopColor="#9f6bad"/>
                  <stop offset="1" stopColor="#ed609d"/>
                </linearGradient>
              </defs>
              <path d="M38.17 0H24.75a4.68 4.68 0 0 0-4.68 4.67V42.1a.85.85 0 0 1-.86.86H4.7a.86.86 0 0 1-.85-.85V14.75a.86.86 0 0 1 .85-.85H16.2a1.9 1.9 0 0 0 1.93-1.92v-1.9H4.68A4.68 4.68 0 0 0 0 14.73V42.1a4.68 4.68 0 0 0 4.68 4.68h14.54a4.68 4.68 0 0 0 4.68-4.67V4.68a.86.86 0 0 1 .86-.86h13.42a.86.86 0 0 1 .85.87v26.57a.85.85 0 0 1-.85.84H27.76A1.92 1.92 0 0 0 25.84 34v1.9h12.33a4.68 4.68 0 0 0 4.68-4.65V4.66A4.68 4.68 0 0 0 38.18 0z" fill="url(#ps-logo-grad)"/>
            </svg>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              AdCanvas CPM Calculator
            </h1>
          </div>
          <div className="ps-tab-bar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={
                  'ps-tab-bar__item' +
                  (activeTab === tab.id ? ' ps-tab-bar__item--active' : '')
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phase 1 — Inputs */}
        <section className="mb-6">
          <CalculatorForm
            values={values}
            onChange={handleChange}
            onReveal={handleReveal}
            revealed={revealed}
          />
        </section>

        {/* Phase 2 — Reveal */}
        {revealed && results && (
          <section key={activeTab} ref={revealRef} className="space-y-6">
            {/* Export capture area */}
            <div ref={resultsRef} className="space-y-6">
              {/* Branded header — export only */}
              <div className="ps-export-only items-center gap-3 px-2 pt-2">
                <svg width="28" height="26" viewBox="0 0 43 47" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <defs>
                    <linearGradient id="ps-logo-exp" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox">
                      <stop offset="0" stopColor="#9f6bad"/>
                      <stop offset="1" stopColor="#ed609d"/>
                    </linearGradient>
                  </defs>
                  <path d="M38.17 0H24.75a4.68 4.68 0 0 0-4.68 4.67V42.1a.85.85 0 0 1-.86.86H4.7a.86.86 0 0 1-.85-.85V14.75a.86.86 0 0 1 .85-.85H16.2a1.9 1.9 0 0 0 1.93-1.92v-1.9H4.68A4.68 4.68 0 0 0 0 14.73V42.1a4.68 4.68 0 0 0 4.68 4.68h14.54a4.68 4.68 0 0 0 4.68-4.67V4.68a.86.86 0 0 1 .86-.86h13.42a.86.86 0 0 1 .85.87v26.57a.85.85 0 0 1-.85.84H27.76A1.92 1.92 0 0 0 25.84 34v1.9h12.33a4.68 4.68 0 0 0 4.68-4.65V4.66A4.68 4.68 0 0 0 38.18 0z" fill="url(#ps-logo-exp)"/>
                </svg>
                <div>
                  <div className="text-sm font-bold text-white tracking-[0.04em]">
                    AdCanvas Efficiency Report
                  </div>
                  <div className="text-[10px] text-[var(--ps-muted)] tracking-[0.06em]">
                    {tabLabel} · {formatCurrency(Number(values.budget) || 0)} Budget
                  </div>
                </div>
              </div>

              <EfficiencyResults results={results} budget={values.budget} />

              {/* Tuner — hidden during export */}
              <div className="ps-hide-on-export">
                <EcpmTuner
                  values={values}
                  onChange={handleChange}
                  showAdvanced={showAdvanced}
                  onToggleAdvanced={() => setShowAdvanced((p) => !p)}
                  vendorCpm={values.vendorCpm}
                />
              </div>

              <InvestmentSummary results={results} />

              {/* Branded footer — export only */}
              <div className="ps-export-only justify-center py-3">
                <span className="text-[10px] text-[var(--ps-muted)] tracking-[0.1em] uppercase">
                  Powered by PadSquad AdCanvas™
                </span>
              </div>
            </div>

            {/* Footer bar */}
            <div className="ps-footer-bar ps-reveal" style={{ animationDelay: '700ms' }}>
              <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase">
                AdCanvas CPM Calculator
              </div>
              <ResultsExport targetRef={resultsRef} activeTab={activeTab} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
