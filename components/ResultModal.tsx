'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

function parseScore(text: string): number | null {
  const match = text.match(/### Score:\s*(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/### Score: (.+)/g, '<div class="score-display">$1</div>')
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '\n')

  return html
    .split('\n')
    .map(line => {
      if (/^<(h3|ul|li|div)/.test(line.trim()) || line.trim() === '') return line
      return `<p>${line}</p>`
    })
    .join('')
}

function resultToDocHtml(manus: string, result: string): string {
  const manusHtml = manus
    .split('\n')
    .map(line => (line.trim() ? `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '<p>&nbsp;</p>'))
    .join('')

  const summaryHtml = result
    .replace(/### Score: (.+)/g, '<h2>Score: $1</h2>')
    .replace(/### (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .split('\n')
    .map(line => {
      if (line.startsWith('<h2>') || line.startsWith('<li>')) return line
      if (line.trim() === '') return '<p>&nbsp;</p>'
      return `<p>${line}</p>`
    })
    .join('')

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Manus och sammanfattning</title>
  <style>
    body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.6; }
    h1 { font-size: 16pt; margin-top: 24pt; margin-bottom: 6pt; }
    h2 { font-size: 13pt; margin-top: 16pt; margin-bottom: 4pt; }
    p { margin-bottom: 6pt; }
    li { margin-bottom: 3pt; }
  </style>
</head>
<body>
<h1>Manus</h1>
${manusHtml}
<h1>Sammanfattning</h1>
${summaryHtml}
</body>
</html>`
}

type Props = {
  text: string
  loading: boolean
  manus: string
  manusTitle: string
  awaitingFollowUp: boolean
  followUpInput: string
  onFollowUpChange: (val: string) => void
  onSendFollowUp: () => void
  onClose: () => void
}

export default function ResultModal({
  text,
  loading,
  manus,
  manusTitle,
  awaitingFollowUp,
  followUpInput,
  onFollowUpChange,
  onSendFollowUp,
  onClose,
}: Props) {
  function handleSave() {
    const html = resultToDocHtml(manus, text)
    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const filename = manusTitle.trim()
      ? `${manusTitle.trim()}.doc`
      : `rekryteringsmanus-${new Date().toLocaleDateString('sv-SE')}.doc`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleNewScript() {
    window.location.reload()
  }

  const isDone = !loading && !!text && !awaitingFollowUp
  const confettiFired = useRef(false)

  useEffect(() => {
    if (confettiFired.current) return
    const score = parseScore(text)
    if (score !== null && score > 80) {
      confettiFired.current = true
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } })
    }
  }, [text])

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <div className="modal-header">
          <div className="modal-title">Manusgranskning</div>
          {loading && <div className="modal-status-dot" />}
        </div>

        {loading && !text && (
          <div className="modal-loading">Granskar manuset…</div>
        )}

        {text && (
          <div
            className="result-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        )}

        {awaitingFollowUp && !loading && (
          <div className="followup-area">
            <div className="section-label">Svar till granskaren</div>
            <textarea
              className="followup-textarea"
              placeholder="Skriv ditt svar här…"
              value={followUpInput}
              onChange={e => onFollowUpChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSendFollowUp()
              }}
            />
            <button className="submit-btn" onClick={onSendFollowUp}>
              Skicka svar ↗
            </button>
          </div>
        )}

        {isDone && (
          <div className="modal-actions">
            <button className="submit-btn" onClick={handleSave}>
              Spara manus och sammanfattning
            </button>
            <button className="secondary-btn" onClick={onClose}>
              Fortsätt redigera
            </button>
            <button className="secondary-btn" onClick={handleNewScript}>
              Skapa nytt manus
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
