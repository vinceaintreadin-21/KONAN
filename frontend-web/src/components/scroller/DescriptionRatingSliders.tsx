interface Slider { label: string; value: number; onChange: (v: number) => void }
interface Props { sliders: Slider[]; average: string }

export function DescriptionRatingSliders({ sliders, average }: Props) {
  return (
    <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-xl p-5 mb-5">
      <div className="font-mono text-[10px] text-[#6b82a8] tracking-[0.18em] uppercase mb-[18px]">
        Description Self-Rating
      </div>
      {sliders.map(({ label, value, onChange }) => (
        <div key={label} className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-[13px] text-[#a8c0e0]">{label}</span>
            <span className="font-mono text-[12px] text-blue-500">{value} / 5</span>
          </div>
          <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between mt-[3px]">
            <span className="font-mono text-[9px] text-[#2d4a6b]">Weak</span>
            <span className="font-mono text-[9px] text-[#2d4a6b]">Strong</span>
          </div>
        </div>
      ))}
      <div className="mt-1.5 px-3 py-2.5 bg-blue-500/[0.06] rounded-lg border border-blue-500/15 flex justify-between items-center">
        <span className="font-mono text-[11px] text-[#6b82a8]">Average Self-Rating</span>
        <span className="font-mono text-[13px] font-bold text-blue-400">{average} / 5.0</span>
      </div>
    </div>
  )
}
