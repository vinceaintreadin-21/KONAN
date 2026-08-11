interface Props {
    roomCode: string 
}

export function RoomCodeDisplay({ roomCode }: Props) {
    return (
        <div className="bg-[#0f1629] border border-[#1e3a6f] rounded-2xl p-7 text-center mb-5">
            <div className="font-mono text-[10px] text-[#6b82a8] tracking-[0.18em] uppercase mb-4">
                Room Code
            </div>
            <div className="flex gap-2 justify-center mb-4">
                {roomCode.split('').map((char, i) => (
                    <div
                        key={i}
                        className="w-[46px] h-[54px] bg-[#1a2240] border border-[#1e3a5f] rounded-lg flex items-center justify-center font-mono text-2xl font-bold text-blue-400"
                    >
                        {char}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center gap-1.5">
                <div className="w-[5px] h-[5px] rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[10px] text-[#6b82a8] tracking-[0.1em]">
                    Waiting for Verifier to join...
                </span>
            </div>
        </div>
    )
}
