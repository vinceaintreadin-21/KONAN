import { useEffect, useState } from 'react'
import { VerdictBadge, VERDICT_COLORS, VERDICT_BGS } from '../components/shared/VerdictBadge'
import { useGameStore } from '../store/gameStore'
import { getScenarioVerifier } from '../services/api'
import type { Verdict } from '../types'

export function RevealPage() {
  const { teamVerdict, setScreen, roomId, scenarioId } = useGameStore()
  const [correctVerdict, setCorrectVerdict] = useState<Verdict>(null)
  const [explanation, setExplanation] = useState('')
  const [primarySignal, setPrimarySignal] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = scenarioId ?? 1
    if (!roomId) {
      setLoading(false)
      return
    }

    getScenarioVerifier(id, roomId)
      .then((data) => {
        setCorrectVerdict(data.correct_verdict as Verdict)
        setExplanation(data.ground_truth_explanation ?? '')
        setPrimarySignal(data.primary_verification_signal ?? '')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading scenario truth data:', err)
        setLoading(false)
      })
  }, [scenarioId, roomId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d18] flex items-center justify-center">
        <div className="font-mono text-[11px] text-[#3d5a7a] tracking-[0.2em] animate-pulse">
          REVEALING VERDICT...
        </div>
      </div>
    )
  }

  const finalCorrectVerdict = correctVerdict ?? 'misleading'
  const correct = teamVerdict === finalCorrectVerdict
  const trueColor = VERDICT_COLORS[finalCorrectVerdict]
  const trueBg    = VERDICT_BGS[finalCorrectVerdict]
  const teamBg    = teamVerdict ? VERDICT_BGS[teamVerdict] : '107,130,168'

  return (
    <div
      className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center font-sans py-10 px-6 relative overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
    >
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none transition-all duration-500"
        style={{ background: `radial-gradient(ellipse, rgba(${correct ? '34,197,94' : '239,68,68'},0.07) 0%, transparent 65%)` }}
      />

      <div className="relative w-full max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-[18px] py-[5px] mb-4 border"
            style={{
              background: correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              borderColor: correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            }}
          >
            <span className="text-sm">{correct ? '🎯' : '✗'}</span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: correct ? '#22c55e' : '#ef4444' }}>
              {correct ? 'Correct Verdict — Well done, team!' : 'Incorrect Verdict — Review findings below'}
            </span>
          </div>
          <h1 className="font-mono text-[clamp(32px,5vw,60px)] font-bold text-[#e8f0fe] mb-2 tracking-[-0.02em]">
            VERDICT REVEALED
          </h1>
          <p className="text-[15px] text-[#6b82a8]">Ground truth vs. team assessment</p>
        </div>

        {/* Comparison cards */}
        <div className="grid mb-10" style={{ gridTemplateColumns: '1fr 56px 1fr' }}>
          <div
            className="bg-[#0f1629] rounded-l-2xl px-7 py-8 text-center border-t border-l border-b"
            style={{ borderColor: `rgba(${teamBg},0.3)` }}
          >
            <div className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.2em] uppercase mb-4">Team Verdict</div>
            <VerdictBadge verdict={teamVerdict} size="lg" />
          </div>

          <div className="flex flex-col items-center justify-center bg-[#0a1020] border-t border-b border-[#1e3a5f]">
            <span className="font-mono text-[10px] text-[#1e3a5f] tracking-[0.1em]">VS</span>
          </div>

          <div
            className="bg-[#0f1629] rounded-r-2xl px-7 py-8 text-center border-2 relative"
            style={{ borderColor: `rgba(${trueBg},0.5)`, boxShadow: `0 0 40px rgba(${trueBg},0.08)` }}
          >
            <div className="absolute top-2.5 right-3 font-mono text-[8px] rounded px-[7px] py-[2px] tracking-[0.1em] border"
              style={{ color: trueColor, background: `rgba(${trueBg},0.12)`, borderColor: `rgba(${trueBg},0.3)` }}>
              TRUTH
            </div>
            <div className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.2em] uppercase mb-4">Ground Truth</div>
            <VerdictBadge verdict={finalCorrectVerdict} size="lg" />
          </div>
        </div>

        {/* Explanation card */}
        <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-2xl p-7 mb-8">
          <div className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.2em] uppercase mb-3">
            Why is this post <span style={{ color: trueColor }}>{finalCorrectVerdict.toUpperCase()}</span>?
          </div>
          <p className="text-[15px] text-[#a8c0e0] leading-[1.72] mb-5">{explanation}</p>
          {primarySignal && (
            <div className="rounded-[10px] px-4 py-3.5 border" style={{ background: `rgba(${trueBg},0.05)`, borderColor: `rgba(${trueBg},0.2)` }}>
              <div className="font-mono text-[9px] tracking-[0.15em] uppercase mb-1.5" style={{ color: trueColor }}>
                Primary Verification Signal
              </div>
              <p className="font-mono text-[12px] text-[#c8d8f0] leading-[1.65] m-0">{primarySignal}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setScreen('score')}
            className="bg-blue-500 text-white rounded-xl px-[52px] py-4 font-mono text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:bg-blue-400 transition-all"
          >
            View Score Breakdown →
          </button>
        </div>
      </div>
    </div>
  )
}
