import { useEffect, useRef, useState } from 'react'
import { getServerStatus, getInterfaceHealth, evaluateInterface } from '../services/piApiService.js'
import { notifyLocal } from '../services/push.js'
import ServerMetrics from './ServerMetrics.jsx'
import InterfaceList from './InterfaceList.jsx'

const POLL_MS = 15000

/** Split-pane layout: fixed server pane on top, scrolling triage list below. */
export default function Dashboard() {
  const [servers, setServers] = useState(null)
  const [interfaces, setInterfaces] = useState([])
  const [error, setError] = useState(null)
  const [updated, setUpdated] = useState(null)
  const alerted = useRef(new Set())

  useEffect(() => {
    let live = true
    async function poll() {
      try {
        const [s, raw] = await Promise.all([getServerStatus(), getInterfaceHealth()])
        if (!live) return
        const list = raw.map(evaluateInterface)
        setServers(s); setInterfaces(list); setError(null); setUpdated(new Date())
        // Local alert once per newly-critical interface; clear when recovered.
        list.forEach((i) => {
          if (i.level === 'crit' && !alerted.current.has(i.id)) { alerted.current.add(i.id); notifyLocal(`${i.name} critical`, i.flags.join(', '), i.id) }
          if (i.level !== 'crit') alerted.current.delete(i.id)
        })
      } catch (e) { if (live) setError(e.message) }
    }
    poll()
    const t = setInterval(poll, POLL_MS)
    return () => { live = false; clearInterval(t) }
  }, [])

  const crit = interfaces.filter((i) => i.level === 'crit').length
  const warn = interfaces.filter((i) => i.level === 'warn').length

  return (
    <div className="flex h-full flex-col">
      <section className="border-b border-line">
        <ServerMetrics servers={servers} />
        <div className="px-3 pb-2 font-mono text-xs text-slate-400">
          {crit} critical · {warn} warning · {error ? <span className="text-crit">offline: {error}</span> : `updated ${updated?.toLocaleTimeString() ?? '…'}`}
        </div>
      </section>
      <InterfaceList interfaces={interfaces} />
    </div>
  )
}
