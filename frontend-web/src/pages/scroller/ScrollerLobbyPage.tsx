import { RoleBadge } from "../../components/scroller/RoleBadge";
import { RoomCodeDisplay } from "../../components/scroller/RoomCodeDisplay";
import { useGameStore } from "../../store/gameStore";
import { createRoom } from "../../services/api";
import { useState, useEffect } from "react";

export function ScrollerLobbyPage() {
    const { setScreen, setRoom, setScenarioId } = useGameStore();
    const [roomCode, setRoomCode] = useState('......')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        createRoom().then((room) => {
            setRoom(room.id, room.room_code)
            if (room.current_scenario) {
                setScenarioId(room.current_scenario)
            }
            setRoomCode(room.room_code)
            setLoading(false)
        })
        .catch(() => {
            setError('Check your internet connection and try again.')
            setLoading(false)
        }) 
    }, [])

    return (
        <div 
            className="min-h-screen bg-[#080d18] flex flex-col items-center justify center font-sans relative px-4 py-6"
            style={{
                backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
            }}
        >
            <div className="relative w-full max-w-[420px]">
                <RoleBadge label="Scroller — Mobile" />
            </div>

            <div className="text-center mb-8">
                <h2 className="font-mono text-[26px] font-bold text-[#e8f0fe] mb-2">
                    Investigation Room
                </h2>
                <p className="text-[14px] text-[#6b82a8]">
                    Share this code with your Verifier partner
                </p>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-center font-mono text-[11px] text-red-400">
                    {error}
                </div>
            ): (
                <RoomCodeDisplay roomCode={loading ? '......' : roomCode} />
            )}
            
            <div className="bg-blue-500/[0.06] border border-blue-500/[0.18] rounded-xl p-4 mb-6 w-full max-w-[420px]">
                <div className="font-mono text-[9px] text-blue-500 tracking-[0.2em] uppercase mb-2">
                    Your Mission
                </div>
                <p className="text-[13px] text-[#a8c0e0] leading-relaxed">
                    You will see a social media post. Describe the account details, image content, and caption to your partner — without editorializing. They will run forensic tools to determine its authenticity.
                </p>
            </div>

            <button
                onClick={() => setScreen('scroller-feed')}
                disabled={loading || !!error}
                className="w-full bg-blue-500 text-white rounded-xl py-4 font-mono text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer shadow-[0_4px_24px_rgba(59,130,246,0.35)] transition-all hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {loading ? 'Generating Room...' : 'Begin Investigation →'}
            </button>
        </div>
    )
}