interface CheckItem { id: string; label: string }
interface Props {
  items: CheckItem[]
  checks: Record<string, boolean>
  onToggle: (id: string) => void
}

export function ObservationChecklist({ items, checks, onToggle }: Props) {
  const checkedCount = Object.values(checks).filter(Boolean).length

  return (
    <>
      {/* Progress bar */}
      <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-[10px] p-[14px_16px] mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-[10px] text-[#6b82a8] tracking-[0.1em]">Coverage</span>
          <span className="font-mono text-[11px] text-blue-400">{checkedCount} / {items.length}</span>
        </div>
        <div className="bg-[#1a2240] rounded-full h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-1 rounded-full transition-[width] duration-300"
            style={{ width: `${(checkedCount / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Toggle list */}
      <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-xl overflow-hidden mb-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`flex items-center justify-between px-4 py-3.5 cursor-pointer gap-3 transition-colors duration-150
              ${checks[item.id] ? 'bg-blue-500/5' : 'bg-transparent'}
              ${i < items.length - 1 ? 'border-b border-[#1a2240]' : ''}
            `}
          >
            <span className={`text-[13px] leading-snug transition-colors duration-150 ${checks[item.id] ? 'text-[#c8d8f0]' : 'text-[#6b82a8]'}`}>
              {item.label}
            </span>
            {/* Toggle */}
            <div className={`w-11 h-6 rounded-full border relative flex-shrink-0 transition-all duration-200 ${checks[item.id] ? 'bg-blue-500 border-blue-500' : 'bg-[#1a2240] border-[#1e3a5f]'}`}>
              <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checks[item.id] ? 'left-[23px]' : 'left-[3px]'}`} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
