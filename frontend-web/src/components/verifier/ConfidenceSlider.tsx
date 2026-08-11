interface Props { value: number; onChange: (v: number) => void }

export function ConfidenceSlider({ value, onChange }: Props) {
  return (
    <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-[10px] p-3.5 mt-1">
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.15em] uppercase">Confidence Level</span>
        <span className="font-mono text-sm font-bold text-blue-500">{value} / 5</span>
      </div>
      <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[8px] text-[#1e3a5f]">Uncertain</span>
        <span className="font-mono text-[8px] text-[#1e3a5f]">Certain</span>
      </div>
    </div>
  )
}
