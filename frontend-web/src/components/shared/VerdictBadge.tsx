import type { Verdict } from '../../types'

const COLORS: Record<string, string> = { verified: '#22c55e', misleading: '#f59e0b', fabricated: '#ef4444' }
const BGS: Record<string, string>    = { verified: '34,197,94', misleading: '245,158,11', fabricated: '239,68,68' }
const ICONS: Record<string, string>  = { verified: '✓', misleading: '⚠', fabricated: '✕' }
const LABELS: Record<string, string> = { verified: 'VERIFIED', misleading: 'MISLEADING', fabricated: 'FABRICATED' }

interface Props {
  verdict: Verdict
  size?: 'sm' | 'lg'
  showTruthBadge?: boolean
}

export function VerdictBadge({ verdict, size = 'lg', showTruthBadge = false }: Props) {
  if (!verdict) return null
  const color = COLORS[verdict]
  const bg    = BGS[verdict]
  const iconSize  = size === 'lg' ? 'text-[26px]' : 'text-base'
  const boxSize   = size === 'lg' ? 'w-16 h-16' : 'w-9 h-9'
  const labelSize = size === 'lg' ? 'text-lg' : 'text-xs'

  return (
    <div className="text-center">
      {showTruthBadge && (
        <div className="absolute top-2.5 right-3 font-mono text-[8px] rounded px-[7px] py-[2px] tracking-[0.1em] border"
          style={{ color, background: `rgba(${bg},0.12)`, borderColor: `rgba(${bg},0.3)` }}>
          TRUTH
        </div>
      )}
      <div
        className={`${boxSize} rounded-2xl flex items-center justify-center font-mono font-bold ${iconSize} mx-auto mb-3.5 border-2`}
        style={{ background: `rgba(${bg},0.15)`, borderColor: color, color, boxShadow: showTruthBadge ? `0 0 24px rgba(${bg},0.25)` : undefined }}
      >
        {ICONS[verdict]}
      </div>
      <div className={`font-mono font-bold ${labelSize}`} style={{ color }}>
        {LABELS[verdict]}
      </div>
    </div>
  )
}

export { COLORS as VERDICT_COLORS, BGS as VERDICT_BGS, ICONS as VERDICT_ICONS, LABELS as VERDICT_LABELS }
