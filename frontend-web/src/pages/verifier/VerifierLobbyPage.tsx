import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { joinRoom, getRoom } from '../../services/api'

export function VerifierLobbyPage() {
  const { setScreen, setRoom, setScenarioId } = useGameStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  
  const handleJoin = async () => {
    if (!code || loading) return 
    setLoading(true)
    setError(null)

    try {
      const player = await joinRoom(code.toUpperCase())
      
      //fetch room
      const room = await getRoom(player.room)
      
      setRoom(room.id, room.room_code)
      if (room.current_scenario) {
        setScenarioId(room.current_scenario)
      } 
      
      setScreen('verifier-dashboard')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Invalid room code or room is full.'
      setError(msg)
      setTimeout(() => setError(null), 2200)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center font-sans relative px-6 py-10"
      style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
    >
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative w-full max-w-[480px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-[7px] bg-blue-500/10 border border-blue-500/20 rounded-full px-[14px] py-1 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-[10px] text-blue-400 tracking-[0.18em] uppercase">Verifier — Desktop Station</span>
          </div>
          <h1 className="font-mono text-[30px] font-bold text-[#e8f0fe] mb-2">Join Investigation</h1>
          <p className="text-[14px] text-[#6b82a8]">Enter the 6-character room code from your Scroller partner</p>
        </div>

        {/* Input */}
        <div className={`bg-[#0f1629] rounded-2xl p-7 mb-5 border transition-colors duration-300 ${!!error ? 'border-red-500' : 'border-[#1e3a5f]'}`}>
          <div className="font-mono text-[10px] text-[#6b82a8] tracking-[0.18em] uppercase mb-3">Room Code</div>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            className={`w-full bg-[#1a2240] rounded-[10px] px-4 py-3.5 font-mono text-[28px] font-bold text-blue-400 tracking-[0.35em] text-center outline-none uppercase border transition-colors duration-300 ${!!error ? 'border-red-500/40' : 'border-[#1e3a5f]'}`}
          />
          {!!error && (
            <div className="font-mono text-[11px] text-red-500 text-center mt-2.5 tracking-[0.1em]">
              ✕ INVALID CODE — Check with your Scroller partner
            </div>
          )}
        </div>

        {/* Role brief */}
        <div className="bg-blue-500/[0.05] border border-blue-500/[0.18] rounded-xl p-4 mb-6">
          <div className="font-mono text-[9px] text-blue-500 tracking-[0.2em] uppercase mb-2">Your Role</div>
          <p className="text-[13px] text-[#a8c0e0] leading-relaxed">
            You are the Fact-Checker. You cannot see the social media post. Run digital forensics tools based on your partner's verbal description, then submit your verdict.
          </p>
        </div>

        <button
          onClick={handleJoin}
          className="w-full bg-blue-500 text-white rounded-xl py-4 font-mono text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer shadow-[0_4px_24px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition-all"
        >
          Enter Investigation Room →
        </button>
        <div className="mt-4 text-center font-mono text-[10px] text-[#2d4a6b]">Demo: type TRUTH7 to enter</div>
      </div>
    </div>
  )
}
