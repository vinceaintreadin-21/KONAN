export function RoleBadge({ label }: { label: string }) {
    return (
        <div className="inline-flex items-center gap-[7px] bg-blue-500/10 border border-blue-500/20 rounded-full px-[14px] py-1 mb-7 text-sm font-mono font-medium tracking-[0.2em] uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-[10px] text-blue-400 tracking-[0.18em] uppercase">
                {label}
            </span>
        </div>
    )
}