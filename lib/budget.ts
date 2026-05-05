import { CHANNELS } from './channels'

export type CpcBudgets = Record<string, string>

export function getTotalCost(
  selected: Set<string>,
  cpcBudgets: CpcBudgets,
  extraAmount: string,
): number {
  let total = 0
  CHANNELS.forEach(ch => {
    if (!selected.has(ch.id)) return
    if (ch.fixedCost) total += ch.fixedCost
    if ((ch.cpc || ch.cpm) && cpcBudgets[ch.id]) total += parseFloat(cpcBudgets[ch.id]) || 0
  })
  total += parseFloat(extraAmount) || 0
  return total
}

export function buildChannelLines(selected: Set<string>, cpcBudgets: CpcBudgets): string[] {
  const lines: string[] = []
  CHANNELS.forEach(ch => {
    if (!selected.has(ch.id)) return
    if (ch.fixedCost) {
      lines.push(
        `${ch.name}: ${ch.fixedCost.toLocaleString('sv-SE')} kr (${ch.id === 'tv' ? 'minimikostnad' : 'fast pris'})`,
      )
    } else if (ch.cpc) {
      const budget = parseFloat(cpcBudgets[ch.id]) || 0
      const clicks = budget ? Math.round(budget / ch.cpc) : 0
      lines.push(
        `${ch.name}: ${budget.toLocaleString('sv-SE')} kr → ca ${clicks.toLocaleString('sv-SE')} klick (${ch.price})`,
      )
    } else if (ch.cpm) {
      const budget = parseFloat(cpcBudgets[ch.id]) || 0
      const impressions = budget ? Math.round((budget / ch.cpm) * 1000) : 0
      lines.push(
        `${ch.name}: ${budget.toLocaleString('sv-SE')} kr → ca ${impressions.toLocaleString('sv-SE')} visningar (${ch.price})`,
      )
    }
  })
  return lines
}
