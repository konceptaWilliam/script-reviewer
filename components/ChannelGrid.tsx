'use client'

import { CHANNEL_GROUPS, CHANNELS } from '@/lib/channels'

type Props = {
  selected: Set<string>
  cpcBudgets: Record<string, string>
  onToggle: (id: string) => void
  onSetCpcBudget: (id: string, val: string) => void
}

export default function ChannelGrid({ selected, cpcBudgets, onToggle, onSetCpcBudget }: Props) {
  const variableSelected = CHANNELS.filter(ch => selected.has(ch.id) && (ch.cpc || ch.cpm))

  return (
    <div>
      {CHANNEL_GROUPS.map(group => (
        <div key={group.label}>
          <div className="channel-section-header">{group.label}</div>
          <div className="channel-grid">
            {group.channels.map(ch => {
              const isSelected = selected.has(ch.id)
              return (
                <div
                  key={ch.id}
                  className={`channel-card${ch.eldin ? ' eldin' : ''}${isSelected ? ' selected' : ''}`}
                  onClick={() => onToggle(ch.id)}
                >
                  {!isSelected && ch.badge && (
                    <span
                      className={`badge${ch.badgeType === 'orange' ? ' orange' : ch.badgeType === 'blue' ? ' blue' : ''}`}
                    >
                      {ch.badge}
                    </span>
                  )}
                  {isSelected && <div className="check-icon">✓</div>}
                  <div className="channel-name">{ch.name}</div>
                  <div className="channel-price">{ch.price}</div>
                  <div className="channel-desc">{ch.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {variableSelected.length > 0 && (
        <div className="cpc-budgets">
          {variableSelected.map(ch => {
            const val = cpcBudgets[ch.id] || ''
            let estimateText = ch.cpm ? '— vis.' : '— klick'
            let hasValue = false
            if (val && parseFloat(val) > 0) {
              hasValue = true
              if (ch.cpc) {
                estimateText =
                  '~' + Math.round(parseFloat(val) / ch.cpc).toLocaleString('sv-SE') + ' klick'
              } else if (ch.cpm) {
                estimateText =
                  '~' +
                  Math.round((parseFloat(val) / ch.cpm) * 1000).toLocaleString('sv-SE') +
                  ' vis.'
              }
            }
            return (
              <div key={ch.id} className={`cpc-budget-row${!hasValue ? ' needs-budget' : ''}`}>
                <span className="cpc-name">{ch.name}</span>
                <span className="cpc-rate">{ch.price}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Budget kr"
                  value={val}
                  onChange={e => onSetCpcBudget(ch.id, e.target.value)}
                />
                <span className={`cpc-clicks${hasValue ? ' has-value' : ''}`}>
                  {estimateText}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
