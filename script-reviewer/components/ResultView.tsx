'use client'

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

type Props = {
  text: string
  loading: boolean
}

export default function ResultView({ text, loading }: Props) {
  return (
    <div className="result-area visible">
      {loading && !text && <div className="result-loading">Granskar manuset…</div>}
      {text && (
        <div
          className="result-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
        />
      )}
    </div>
  )
}
