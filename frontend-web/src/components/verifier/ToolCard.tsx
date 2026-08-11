import type { ToolStatus } from '../../types'
import { TOOLS } from '../../data/toolsData'

interface Props {
  toolId: string
  status: ToolStatus
  scanProgress: number
  onRun: (id: string) => void
  toolData?: Record<string, any>
}

const isDangerous = (key: string, val: unknown): boolean => {
  const str = String(val).toUpperCase()
  return str.includes('NOT FOUND') || str.includes('ABSENT') || str.includes('AI GENERATED') ||
    str.includes('VERY LOW') || str.includes('DETECTED') || str.includes('HIGH PROBABILITY') ||
    str.includes('NO MATCH') || key === 'disinfo_site_results'
}

const formatValue = (val: unknown): string => {
  if (typeof val === 'boolean') return val ? 'true' : 'false'
  if (Array.isArray(val)) return val.join(', ')
  return String(val)
}

export function ToolCard({ toolId, status, scanProgress, onRun, toolData }: Props) {
  const tool = TOOLS[toolId]
  const statusColor = status === 'complete' ? '#22c55e' : status === 'scanning' ? '#f59e0b' : '#2d4a6b'
  const statusLabel = status === 'complete' ? 'COMPLETE' : status === 'scanning' ? 'SCANNING' : 'IDLE'
  const borderColor = status === 'complete' ? 'border-green-500/30' : status === 'scanning' ? 'border-amber-500/30' : 'border-[#1e3a5f]'
  const headerBg = status === 'complete' ? 'bg-green-500/[0.04]' : status === 'scanning' ? 'bg-amber-500/[0.04]' : 'bg-transparent'

  // Fallback to static data if no backend data is supplied
  const activeData = toolData ?? tool.data

  return (
    <div className={`bg-[#0f1629] border ${borderColor} rounded-xl overflow-hidden flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <div className={`px-3.5 py-2.5 border-b border-[#1a2240] flex items-center justify-between ${headerBg} transition-all duration-300`}>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-sm" style={{ color: statusColor }}>{tool.icon}</span>
          <span className="font-mono text-[11px] font-bold text-[#c8d8f0] tracking-[0.05em]">{tool.shortLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[5px] h-[5px] rounded-full transition-colors" style={{ background: statusColor, animation: status === 'scanning' ? 'pulse 0.8s infinite' : 'none' }} />
          <span className="font-mono text-[8px] tracking-[0.15em]" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3 flex-1 min-h-[120px]">
        {status === 'idle' && (
          <div>
            <p className="text-[11px] text-[#6b82a8] leading-relaxed mb-3">{tool.description}</p>
            <button
              onClick={() => onRun(toolId)}
              className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/22 rounded-md py-2 font-mono text-[10px] font-bold tracking-[0.12em] uppercase cursor-pointer transition-all hover:bg-blue-500/20 hover:border-blue-500/45"
            >
              ▶ Run Scan
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div>
            <div className="mb-2.5">
              <div className="flex justify-between mb-1">
                <span className="font-mono text-[9px] text-amber-400">Querying database...</span>
                <span className="font-mono text-[9px] text-amber-400">{scanProgress}%</span>
              </div>
              <div className="bg-[#1a2240] rounded-sm h-[3px] overflow-hidden">
                <div className="h-[3px] bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)] transition-[width] duration-100" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
            {tool.scanLogs.slice(0, Math.ceil((scanProgress / 100) * tool.scanLogs.length)).map((line, i) => (
              <div key={i} className="font-mono text-[9px] text-[#6b82a8] leading-[1.7]">
                <span className="text-[#2d5a8f]">&gt; </span>{line}
              </div>
            ))}
          </div>
        )}

        {status === 'complete' && (
          <div>
            {Object.entries(activeData).map(([key, value]) => {
              const dangerous = isDangerous(key, value)
              const isHighNum = typeof value === 'number' && value > 100
              const color = dangerous ? '#ef4444' : isHighNum ? '#f59e0b' : typeof value === 'boolean' ? (value ? '#22c55e' : '#ef4444') : '#a8c0e0'
              return (
                <div key={key} className="mb-[5px] leading-[1.5]">
                  <span className="font-mono text-[9px] text-[#3d5a7a]">{key.replace(/_/g, ' ')}: </span>
                  <span className="font-mono text-[9px] break-all" style={{ color, fontWeight: dangerous ? 700 : 400 }}>
                    {formatValue(value)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
