import { useState, useEffect, useRef } from 'react'
import { RoleBadge } from '../../components/scroller/RoleBadge'
import { useGameStore } from '../../store/gameStore'
import { getRoom, getAttempts } from '../../services/api'

const STEPS = [
  { label: 'Account History Scan', done: true },
  { label: 'Image Metadata Analysis', done: true },
  { label: 'Cross-Source Verification', done: false },
  { label: 'Verdict Compilation', done: false },
]

export function ScrollerWaitPage() {
  const { setScreen, roomId, scenarioId, setTeamVerdict, setScores } = useGameStore();
  const [dots, setDots] = useState('');
  const [phase, setPhase] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const d = setInterval(() => setDots((p) => (p.length >= 3 ? '' : p + '.')), 450)
    const p = setInterval(() => setPhase((v) => Math.min(v + 1, 2)), 3000)
    return () => { clearInterval(d); clearInterval(p) }
  }, [])

  useEffect(() => {
    if (!roomId) return;
    intervalRef.current = setInterval(async () => {
      try {
        const room = await getRoom(roomId);
        if (room.phase === 'reveal') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          
          // fetch attempt to retrieve the Verifier's results and scores
          const id = scenarioId ?? 1
          const attempts = await getAttempts()
          const foundAttempt = attempts.find(
            (a: any) => a.room === roomId && a.scenario === id 
          )

          if (foundAttempt) {
            setTeamVerdict(foundAttempt.verdict_chosen)
            setScores(foundAttempt.score_scroller, foundAttempt.score_verifier, foundAttempt.is_correct)
          }
          setScreen('reveal');
        }
      } catch (error) {
        console.error('Error checking room phase:', error)
      }
    }, 2500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [roomId, scenarioId, setScreen])

  const steps = STEPS.map((s, i) => ({ ...s, done: s.done || i < phase }))

  return (
    <div className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center font-sans relative px-4"
      style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
    >
      <div className="relative w-full max-w-[400px] text-center">
        <RoleBadge label="Scroller — Waiting" />

        {/* Radar */}
        <div className="w-[120px] h-[120px] mx-auto mb-7 relative">
          {[0, 15, 30, 45].map((inset) => (
            <div key={inset} className="absolute rounded-full border border-blue-500/20" style={{ inset: `${inset}px` }} />
          ))}
          <div className="absolute inset-0 rounded-full animate-spin" style={{ background: 'conic-gradient(from 0deg, transparent 75%, rgba(59,130,246,0.25) 100%)', animationDuration: '2.5s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.8)] animate-pulse" />
          </div>
        </div>

        <div className="font-mono text-[10px] text-blue-500 tracking-[0.2em] uppercase mb-2.5">
          Investigation In Progress
        </div>
        <h2 className="font-mono text-[22px] font-bold text-[#e8f0fe] mb-2.5">
          Waiting for Verifier{dots}
        </h2>
        <p className="text-[14px] text-[#6b82a8] leading-relaxed mb-7">
          Your partner is running forensic analysis tools. Stay available — they may need clarification on what you described.
        </p>

        {/* Tool status */}
        <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-xl p-5 mb-6 text-left">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-2.5 ${i < steps.length - 1 ? 'mb-3' : ''}`}>
              <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold border transition-all duration-400
                ${step.done ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-blue-500/10 border-[#1e3a5f] text-[#2d4a6b]'}`}>
                {step.done ? '✓' : '○'}
              </div>
              <span className={`font-mono text-[12px] flex-1 transition-colors duration-400 ${step.done ? 'text-green-500' : 'text-[#6b82a8]'}`}>
                {step.label}
              </span>
              {!step.done && <span className="font-mono text-[10px] text-blue-500 animate-pulse">RUNNING</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
