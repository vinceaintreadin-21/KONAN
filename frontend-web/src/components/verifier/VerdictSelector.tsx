import type { Verdict } from '../../types'

type NonNullVerdict = Exclude<Verdict, null>

const CONFIG: Record<NonNullVerdict, { color: string; bg: string; icon: string; label: string; desc: string }> = {
  verified:   { color: '#22c55e', bg: '34,197,94',   icon: '✓', label: 'VERIFIED',   desc: 'Claim is accurate and credibly sourced' },
  misleading: { color: '#f59e0b', bg: '245,158,11',  icon: '⚠', label: 'MISLEADING', desc: 'Partly true but distorted or out of context' },
  fabricated: { color: '#ef4444', bg: '239,68,68',   icon: '✕', label: 'FABRICATED', desc: 'False, fabricated, or AI-generated content' },
}

interface Props {
  verdict: Verdict
  onSelect: (v: NonNullVerdict) => void
}

export function VerdictSelector({ verdict, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {(Object.entries(CONFIG) as [NonNullVerdict, typeof CONFIG[NonNullVerdict]][]).map(([v, cfg]) => {
        const selected = verdict === v
        return (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={`flex items-center gap-3 text-left rounded-[10px] px-3.5 py-3 cursor-pointer outline-none transition-all duration-200
              ${selected ? 'border-2' : 'border border-[#1e3a5f] bg-[#0f1629]'}`}
            style={selected ? { background: `rgba(${cfg.bg},0.1)`, borderColor: cfg.color } : {}}
          >
            <div
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center font-mono text-base font-bold flex-shrink-0 transition-all duration-200"
              style={{ background: selected ? `rgba(${cfg.bg},0.18)` : '#1a2240', color: selected ? cfg.color : '#2d4a6b' }}
            >
              {cfg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[12px] font-bold mb-0.5 transition-colors duration-200" style={{ color: selected ? cfg.color : '#7a96b8' }}>
                {cfg.label}
              </div>
              <div className="text-[10px] text-[#3d5a7a] leading-snug">{cfg.desc}</div>
            </div>
            {selected && (
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0" style={{ background: cfg.color }}>
                ✓
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { CONFIG as VERDICT_CONFIG }
