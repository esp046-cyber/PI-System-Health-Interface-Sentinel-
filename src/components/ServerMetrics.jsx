import StatusDot from './StatusDot.jsx'

const toLevel = (s) => (s === 'online' ? 'ok' : s === 'degraded' ? 'warn' : 'crit')

function Card({ server, extra }) {
  const level = toLevel(server.status)
  return (
    <div className="flex-1 rounded-md border border-line bg-raised p-3">
      <div className="flex items-center gap-2 text-sm font-medium"><StatusDot level={level} pulse />{server.name}</div>
      <div className="mt-2 font-mono text-2xl">{server.latencyMs}<span className="text-sm text-slate-400"> ms</span></div>
      <div className="mt-1 text-xs text-slate-400">{extra}</div>
    </div>
  )
}

/** Top pane: PI Data Archive + AF Server connectivity. */
export default function ServerMetrics({ servers }) {
  if (!servers) return <div className="p-3 text-slate-400">Connecting to PI servers…</div>
  const { dataArchive: d, afServer: a } = servers
  return (
    <div className="flex gap-3 p-3">
      <Card server={d} extra={d.eventsPerSec ? `${d.eventsPerSec} events/s · archive ${d.archiveFreePct}% free` : 'Live'} />
      <Card server={a} extra={a.elementsCount ? `${a.elementsCount} elements · SQL sync ${a.sqlSyncOk ? 'ok' : 'FAILED'}` : 'Live'} />
    </div>
  )
}
