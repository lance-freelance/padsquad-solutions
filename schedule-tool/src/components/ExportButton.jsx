import { useState } from 'react'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PdfDocument } from './PdfDocument'

const TIMELINE_ID = 'campaign-timeline-export'
const PNG_WIDTH = 1600
const PNG_HEIGHT = 900

/**
 * Export actions: PDF (branded) and PNG (timeline section at 1600×900).
 */
export function ExportButton({ timelineRef, milestones, anchorDate, dateType, designMode, smartCommerce }) {
  const [pngBusy, setPngBusy] = useState(false)

  const handlePng = async () => {
    const el = timelineRef?.current || document.getElementById(TIMELINE_ID)
    if (!el) return
    setPngBusy(true)
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#14133A',
      })
      // Output at 1600×900: scale to fit and center
      const out = document.createElement('canvas')
      out.width = PNG_WIDTH
      out.height = PNG_HEIGHT
      const ctx = out.getContext('2d')
      ctx.fillStyle = '#14133A'
      ctx.fillRect(0, 0, PNG_WIDTH, PNG_HEIGHT)
      const scale = Math.min(PNG_WIDTH / canvas.width, PNG_HEIGHT / canvas.height)
      const w = canvas.width * scale
      const h = canvas.height * scale
      ctx.drawImage(canvas, (PNG_WIDTH - w) / 2, (PNG_HEIGHT - h) / 2, w, h)
      const dataUrl = out.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `PadSquad_CampaignTimeline_${format(anchorDate || new Date(), 'yyyy-MM-dd')}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setPngBusy(false)
    }
  }

  const hasMilestones = milestones && milestones.length > 0
  const anchorLabel = anchorDate ? format(anchorDate, 'yyyy-MM-dd') : 'schedule'

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasMilestones && (
        <PDFDownloadLink
          document={
            <PdfDocument
              milestones={milestones}
              anchorDate={anchorDate}
              dateType={dateType}
              designMode={designMode}
              smartCommerce={smartCommerce}
            />
          }
          fileName={`PadSquad_CampaignTimeline_${anchorLabel}.pdf`}
          className="ps-btn ps-btn--primary"
        >
          {({ loading }) => (loading ? 'Preparing…' : 'Download PDF')}
        </PDFDownloadLink>
      )}
      <button
        type="button"
        onClick={handlePng}
        disabled={!hasMilestones || pngBusy}
        className="ps-btn ps-btn--secondary"
      >
        {pngBusy ? 'Exporting…' : 'Download PNG'}
      </button>
    </div>
  )
}

export default ExportButton
