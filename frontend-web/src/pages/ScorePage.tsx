import { GROUND_TRUTH } from '../data/toolsData'
import { useGameStore } from '../store/gameStore'
import { nextRound as apiNextRound } from '../services/api'

export function ScorePage() {
  const { teamVerdict, resetGame, scoreScroller, scoreVerifier, isCorrect, roomId, nextRound } = useGameStore()
  const correct        = isCorrect ?? (teamVerdict === GROUND_TRUTH.verdict)
  const scrollerScore  = scoreScroller ?? 0
  const verifierScore  = scoreVerifier ?? 0
  const totalScore     = scrollerScore + verifierScore
  const maxScore       = 200
  const pct            = Math.round((totalScore / maxScore) * 100)
  const rating         = totalScore >= 150 ? 'Excellent' : totalScore >= 100 ? 'Good' : 'Needs Improvement'

  const scrollerBreakdown = [
    { label: 'Checklist Coverage (7/8)', pts: 30 },
    { label: 'Neutrality Rating (4/5)', pts: 22 },
    { label: 'Completeness Rating (4/5)', pts: 20 },
  ]
  const verifierBreakdown = correct
    ? [{ label: 'Correct Verdict', pts: 30, highlight: true }, { label: 'Tools Utilized (5/6)', pts: 12, highlight: false }, { label: 'Confidence Accuracy', pts: 6, highlight: false }]
    : [{ label: 'Incorrect Verdict', pts: 0, highlight: false }, { label: 'Tools Utilized (5/6)', pts: 12, highlight: false }, { label: 'Investigation Effort', pts: 6, highlight: false }]

  const handleNextRound = async () => {
    if (!roomId) {
      resetGame() //fallback if no room
      return
    }
    try {
      const room = await apiNextRound(roomId)
      if (room.current_scenario) {
        nextRound(room.current_scenario)
      } else {
        resetGame() //if no more scenarios available, go back to main
      }
    } catch (e) {
      console.error('Failed to advance round', e)
      resetGame()
    }
  }

  return (
    <div
      className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center font-sans py-10 px-6 relative overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
    >
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative w-full max-w-[820px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="font-mono text-[9px] text-blue-500 tracking-[0.25em] uppercase mb-2.5">
            Round 1 Complete — Score Breakdown
          </div>
          <h1 className="font-mono text-[clamp(30px,5vw,52px)] font-bold text-[#e8f0fe] tracking-[-0.02em]">
            MISSION DEBRIEF
          </h1>
        </div>

        {/* Total score */}
        <div className="bg-[#0f1629] border border-[#1e3a5f] rounded-2xl p-7 text-center mb-5">
          <div className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.2em] uppercase mb-2">Team Score — Round 1</div>
          <div className="font-mono text-[clamp(52px,8vw,80px)] font-bold text-blue-500 leading-none tracking-[-0.03em]">
            {totalScore}
          </div>
          <div className="font-mono text-[13px] text-[#1e3a5f] mt-1">/ {maxScore} points possible</div>
          <div className="bg-[#1a2240] rounded-full h-[5px] mt-[18px] overflow-hidden">
            <div
              className="h-[5px] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              style={{ width: `${(totalScore / maxScore) * 100}%`, background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)' }}
            />
          </div>
          <div className="font-mono text-[10px] text-[#2d4a6b] mt-2">{pct}% — {rating}</div>
        </div>

        {/* Player score cards */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            { emoji: '📱', role: 'Scroller', sub: 'Description Quality', score: scrollerScore, breakdown: scrollerBreakdown },
            { emoji: '🖥️', role: 'Verifier', sub: 'Investigation Quality', score: verifierScore, breakdown: verifierBreakdown },
          ].map(({ emoji, role, sub, score, breakdown }) => (
            <div key={role} className="bg-[#0f1629] border border-[#1e3a5f] rounded-2xl p-[22px]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-[34px] h-[34px] rounded-[9px] bg-blue-500/12 border border-blue-500/20 flex items-center justify-center text-base">
                  {emoji}
                </div>
                <div>
                  <div className="font-mono text-[12px] font-bold text-[#e8f0fe] mb-px">{role}</div>
                  <div className="font-mono text-[9px] text-[#3d5a7a]">{sub}</div>
                </div>
              </div>
              <div className="font-mono text-[44px] font-bold text-blue-400 leading-none mb-4">{score}</div>
              <div className="flex flex-col gap-1.5 pt-3 border-t border-[#1a2240]">
                {(breakdown as { label: string; pts: number; highlight?: boolean }[]).map(({ label, pts, highlight }) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="font-mono text-[10px] leading-snug flex-1" style={{ color: highlight ? '#22c55e' : '#3d5a7a' }}>
                      {label}
                    </span>
                    <span className="font-mono text-[11px] font-bold flex-shrink-0" style={{ color: pts > 0 ? '#60a5fa' : '#ef4444' }}>
                      +{pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Literacy tip */}
        <div className="bg-blue-500/[0.05] border border-blue-500/[0.18] rounded-xl px-5 py-4 mb-8 flex gap-3.5 items-start">
          <div className="w-[28px] h-[28px] rounded-[7px] bg-blue-500/12 border border-blue-500/20 flex items-center justify-center text-sm flex-shrink-0 mt-px">
            💡
          </div>
          <div>
            <div className="font-mono text-[9px] text-blue-500 tracking-[0.18em] uppercase mb-1.5">Media Literacy Tip</div>
            <p className="text-[13px] text-[#a8c0e0] leading-[1.65] m-0">
              When evaluating social posts, check account age and username history first — newly created accounts with sudden follower spikes are a primary indicator of coordinated inauthentic behavior. Always verify claims against official source sites directly.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleNextRound}
            className="bg-blue-500 text-white rounded-xl px-[52px] py-4 font-mono text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:bg-blue-400 transition-all"
          >
            Play Next Round →
          </button>
        </div>
      </div>
    </div>
  )
}
