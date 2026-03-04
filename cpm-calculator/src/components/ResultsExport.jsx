import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas'

export function ResultsExport({ targetRef, activeTab }) {
  const [exporting, setExporting] = useState(false)

  const dateStr = new Date().toISOString().slice(0, 10)
  const tabLabel = activeTab === 'video' ? 'Video' : 'Display'
  const filename = `PadSquad_AdCanvas_Efficiency_${tabLabel}_${dateStr}.png`

  const handleExport = useCallback(async () => {
    if (!targetRef.current) return
    setExporting(true)
    try {
      // Toggle export mode — shows branded header/footer, hides tuner,
      // and forces all animated elements to opacity:1 via CSS
      targetRef.current.classList.add('ps-exporting')

      // Wait for DOM/style updates to settle before capturing
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#14133A',
        scale: 2,
      })
      targetRef.current.classList.remove('ps-exporting')

      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      targetRef.current?.classList.remove('ps-exporting')
      setExporting(false)
    }
  }, [targetRef, filename])

  return (
    <button
      type="button"
      className="ps-btn ps-btn--primary"
      onClick={handleExport}
      disabled={exporting}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {exporting ? 'Exporting…' : 'Download PNG'}
    </button>
  )
}

export default ResultsExport
