const COLORS = { ok: 'bg-ok', warn: 'bg-warn', crit: 'bg-crit' }
/** Traffic-light indicator. Level: ok | warn | crit */
export default function StatusDot({ level, pulse = false }) {
  return <span className={`inline-block size-3 rounded-full ${COLORS[level]} ${pulse && level === 'crit' ? 'animate-pulse' : ''}`} aria-label={level} />
}
