type Props = {
  total: number
  cap: number
}

export default function BudgetBar({ total, cap }: Props) {
  const pct = Math.min((total / cap) * 100, 100)
  const over = total > cap

  return (
    <div className="budget-section">
      <div className="budget-header">
        <span className="budget-label">Total budgetanvändning</span>
        <span className="budget-amount">
          <span>{total.toLocaleString('sv-SE')}</span> / 20 000 kr
        </span>
      </div>
      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill${over ? ' over' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`budget-note${over ? ' over' : ''}`}>
        {over
          ? `⚠ Överstiger budgettaket med ${(total - cap).toLocaleString('sv-SE')} kr`
          : `Kvar: ${(cap - total).toLocaleString('sv-SE')} kr`}
      </div>
    </div>
  )
}
