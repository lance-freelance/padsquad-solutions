import { useCallback } from 'react';
import html2canvas from 'html2canvas';

export default function ResultsExport({ targetRef }) {
  const handleExport = useCallback(async () => {
    if (!targetRef.current) return;
    const canvas = await html2canvas(targetRef.current, {
      backgroundColor: '#14133A',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = 'cpm-efficiency-results.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [targetRef]);

  const handleCopy = useCallback(async () => {
    if (!targetRef.current) return;
    const canvas = await html2canvas(targetRef.current, {
      backgroundColor: '#14133A',
      scale: 2,
    });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
      } catch {
        const link = document.createElement('a');
        link.download = 'cpm-efficiency-results.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }, 'image/png');
  }, [targetRef]);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="ps-ds-btn ps-ds-btn--primary"
        onClick={handleExport}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export PNG
      </button>
      <button
        type="button"
        className="ps-ds-btn ps-ds-btn--secondary"
        style={{ color: 'white', borderColor: 'var(--ps-pink)' }}
        onClick={handleCopy}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Copy Image
      </button>
    </div>
  );
}
