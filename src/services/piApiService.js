/**
 * PI Web API service layer.
 * VITE_USE_MOCK=true (default) -> generated data. Set to "false" for a live PI Web API.
 * NOTE: VITE_* vars are bundled into client code. For production, front the PI Web API
 * with a small proxy that holds the credentials rather than shipping them to the browser.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = import.meta.env.VITE_PI_WEB_API_URL // e.g. https://piserver/piwebapi
const AUTH = import.meta.env.VITE_PI_USER
  ? 'Basic ' + btoa(`${import.meta.env.VITE_PI_USER}:${import.meta.env.VITE_PI_PASSWORD}`)
  : undefined

// ---- Alert thresholds (seconds / counts) ----
export const THRESHOLDS = { staleWarn: 120, staleCrit: 600, backupWarn: 50, backupCrit: 500 }

// ---------------- Mock data ----------------
const NAMES = ['OPC_Unit1', 'OPC_Unit2', 'OPC_Unit3', 'Modbus_Pump', 'PIPing_Lab', 'RDBMS_MES',
  'Historian_Tank', 'DNP3_Sub1', 'DNP3_Sub2', 'OPCUA_Boiler', 'PItoPI_Site2', 'Connector_Wonderware']
const rand = (n) => Math.floor(Math.random() * n)

function mockInterfaces() {
  return NAMES.map((name, i) => {
    const roll = Math.random()
    const status = roll < 0.12 ? 'offline' : roll < 0.3 ? 'degraded' : 'online'
    return {
      id: `IF-${i + 1}`, name, node: `PINODE-${(i % 4) + 1}`, status,
      lastValueAgeSec: status === 'offline' ? 600 + rand(3600) : status === 'degraded' ? 90 + rand(500) : rand(30),
      bufferBacklog: status === 'online' ? 0 : rand(900),
      updatesPerMin: status === 'offline' ? 0 : 20 + rand(400),
    }
  })
}

function mockServers() {
  const st = () => (Math.random() < 0.85 ? 'online' : Math.random() < 0.6 ? 'degraded' : 'offline')
  return {
    dataArchive: { name: 'PI Data Archive', status: st(), latencyMs: 8 + rand(80), eventsPerSec: 800 + rand(2500), archiveFreePct: 20 + rand(70) },
    afServer: { name: 'AF Server', status: st(), latencyMs: 12 + rand(120), elementsCount: 18450, sqlSyncOk: Math.random() > 0.1 },
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------- Live endpoints ----------------
async function piGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers: AUTH ? { Authorization: AUTH } : {} })
  if (!res.ok) throw new Error(`PI Web API ${res.status} on ${path}`)
  return res.json()
}

export async function getServerStatus() {
  if (USE_MOCK) { await delay(250); return mockServers() }
  const t0 = performance.now()
  const [da, af] = await Promise.all([piGet('/dataservers'), piGet('/assetservers')])
  const latencyMs = Math.round(performance.now() - t0)
  const map = (s, name) => ({ name, status: s?.IsConnected ? 'online' : 'offline', latencyMs })
  return { dataArchive: map(da.Items?.[0], 'PI Data Archive'), afServer: map(af.Items?.[0], 'AF Server') }
}

/**
 * Interface health. PI Web API has no direct "interface" endpoint; the usual pattern is reading
 * the interface health tags (e.g. IF_<name>_Heartbeat, _Status, _Latency) created by PI Interface Status.
 * TODO: adapt the search query and mapping to your tag naming convention.
 */
export async function getInterfaceHealth() {
  if (USE_MOCK) { await delay(300); return mockInterfaces() }
  const pts = await piGet('/dataservers/DATASERVER_WEBID/points?nameFilter=IF_*_Heartbeat')
  return pts.Items.map((p) => ({ id: p.WebId, name: p.Name.replace(/^IF_|_Heartbeat$/g, ''), node: 'n/a',
    status: 'degraded', lastValueAgeSec: 0, bufferBacklog: 0, updatesPerMin: 0 }))
}

// ---------------- Alert flags (front-end logic) ----------------
export function evaluateInterface(i) {
  const flags = []
  if (i.status === 'offline') flags.push('Disconnected node')
  if (i.lastValueAgeSec >= THRESHOLDS.staleCrit) flags.push('Data stale >10 min')
  else if (i.lastValueAgeSec >= THRESHOLDS.staleWarn) flags.push('Data stale')
  if (i.bufferBacklog >= THRESHOLDS.backupCrit) flags.push('Buffer backup (critical)')
  else if (i.bufferBacklog >= THRESHOLDS.backupWarn) flags.push('Buffer backing up')
  const critical = i.status === 'offline' || i.lastValueAgeSec >= THRESHOLDS.staleCrit || i.bufferBacklog >= THRESHOLDS.backupCrit
  const level = critical ? 'crit' : flags.length || i.status === 'degraded' ? 'warn' : 'ok'
  return { ...i, flags, level }
}
