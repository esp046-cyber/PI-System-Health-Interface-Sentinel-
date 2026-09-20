import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import { enablePush } from './services/push.js'

export default function App() {
  const [msg, setMsg] = useState('')
  const turnOn = () => enablePush().then((r) => setMsg(r.local ? 'Local alerts on' : 'Push on')).catch((e) => setMsg(e.message))

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-line px-3 py-2">
        <h1 className="text-base font-semibold">PI Sentinel</h1>
        <button onClick={turnOn} className="rounded-md border border-line px-3 py-1 text-sm">{msg || 'Enable alerts'}</button>
      </header>
      <main className="min-h-0 flex-1"><Dashboard /></main>
    </div>
  )
}
