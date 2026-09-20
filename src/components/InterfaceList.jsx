import { useMemo, useState } from 'react'
import StatusDot from './StatusDot.jsx'

const ORDER = { crit: 0, warn: 1, ok: 2 }

/** Bottom pane: searchable triage list, worst first. Healthy interfaces are hidden by default. */
export default function InterfaceList({ interfaces }) {
  const [q, setQ] = useState('')
  const [showAll, setShowAll] = useState(false)

  const rows = useMemo(() => interfaces
    .filter((i) => (showAll || i.level !== 'ok') && `${i.name} ${i.node}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => ORDER[a.level] - ORDER[b.level] || b.lastValueAgeSec - a.lastValueAgeSec),
  [interfaces, q, showAll])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-2 px-3 pb-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search interface or node"
          className="min-w-0 flex-1 rounded-md border border-line bg-raised px-3 py-2 text-sm outline-none focus:border-ok" />
        <button onClick={() => setShowAll((v) => !v)} className="rounded-md border border-line px-3 text-sm">
          {showAll ? 'Issues only' : 'Show all'}
        </button>
      </div>
      <ul className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {rows.length === 0 && <li className="p-6 text-center text-slate-400">No interfaces match. Clear the search or tap Show all.</li>}
        {rows.map((i) => (
          <li key={i.id} className="rounded-md border border-line bg-raised p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium"><StatusDot level={i.level} pulse />{i.name}</span>
              <span className="font-mono text-xs text-slate-400">{i.node}</span>
            </div>
            <div className="mt-1 font-mono text-xs text-slate-400">
              last value {i.lastValueAgeSec}s ago · backlog {i.bufferBacklog} · {i.updatesPerMin}/min
            </div>
            {i.flags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {i.flags.map((f) => <span key={f} className={`rounded px-2 py-0.5 text-xs ${i.level === 'crit' ? 'bg-crit/20 text-crit' : 'bg-warn/20 text-warn'}`}>{f}</span>)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
