import { useState, useCallback, useEffect } from 'react'
import { ToolCard } from '../../components/verifier/ToolCard'
import { VerdictSelector, VERDICT_CONFIG } from '../../components/verifier/VerdictSelector'
import { ConfidenceSlider } from '../../components/verifier/ConfidenceSlider'
import { SessionTimer } from '../../components/verifier/SessionTimer'
import { TOOLS } from '../../data/toolsData'
import { useGameStore } from '../../store/gameStore'
import { updateAttempt, getScenarioVerifier, getAttempts } from '../../services/api'
import type { ScenarioVerifierResponse } from '../../services/api'
import type { Verdict, ToolStatus } from '../../types'

type NonNullVerdict = Exclude<Verdict, null>
const ASK_PROMPTS = [
  'Account handle & display name',
  'Follower count (approx.)',
  'Verification badge present?',
  'Post type & image content',
  'Caption key claims',
  'Hashtags used',
  'Any visual anomalies?',
]

export function VerifierDashboardPage() {
  const { setScreen, setTeamVerdict, setScores, roomId, roomCode, scenarioId } = useGameStore()
  const [notes, setNotes] = useState('')
  const [toolStatuses, setToolStatuses] = useState<Record<string, ToolStatus>>(
    Object.keys(TOOLS).reduce((acc, k) => ({ ...acc, [k]: 'idle' }), {})
  )
  const [scanProgress, setScanProgress] = useState<Record<string, number>>(
    Object.keys(TOOLS).reduce((acc, k) => ({ ...acc, [k]: 0 }), {})
  )
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [confidence, setConfidence] = useState(3)
  const [submitting, setSubmitting] = useState(false)

  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [scenarioData, setScenarioData] = useState<ScenarioVerifierResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch the verifier scenario payload (tool output JSONs) on mount
  useEffect(() => {
    const id = scenarioId ?? 1
    if (!roomId) {
      setLoading(false)
      return
    }
    Promise.all([
      getScenarioVerifier(id, roomId),
      getAttempts()
    ])
    .then(([scenarioRes, attemptRes]) => {
      setScenarioData(scenarioRes)
      const foundAttempt = attemptRes.find(
        (a: any) => a.room === roomId && a.scenario === id 
      )
      if (foundAttempt) {
        setAttemptId(foundAttempt.id)
      }
      setLoading(false)
    })
    .catch((err) => {
      console.error("Failed to initialize dashboard:", err)
      setLoading(false)
    })
  }, [scenarioId, roomId])

  const runTool = useCallback((toolId: string) => {
    if (toolStatuses[toolId] !== 'idle') return
    setToolStatuses((s) => ({ ...s, [toolId]: 'scanning' }))
    setScanProgress((p) => ({ ...p, [toolId]: 0 }))
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 6
      if (progress >= 100) {
        clearInterval(interval)
        setScanProgress((p) => ({ ...p, [toolId]: 100 }))
        setTimeout(() => setToolStatuses((s) => ({ ...s, [toolId]: 'complete' })), 200)
      } else {
        setScanProgress((p) => ({ ...p, [toolId]: Math.floor(progress) }))
      }
    }, 80)
  }, [toolStatuses])

  const handleSubmit = async () => {
    if (!verdict || submitting) return
    setSubmitting(true)
    setTeamVerdict(verdict)

    let currentAttemptId = attemptId

    //dynamically fetch the attempt id if not already present
    if (!currentAttemptId) {
      try {
        const id = scenarioId ?? 1
        const attemptsRes = await getAttempts()
        const foundAttempt = attemptsRes.find(
          (a: any) => a.room === roomId && a.scenario === id 
        )
        if (foundAttempt) {
          currentAttemptId = foundAttempt.id
          setAttemptId(currentAttemptId)
        }
      } catch (err) {
        console.error("Failed to find attempt:", err)
      }
    }

    //show alert if the scroller hasnt submitted yet
    if(!currentAttemptId) {
      alert("Waiting for Scroller to submit their checklist first!")
      setSubmitting(false)
      return
    }
    
    const completedTools = Object.entries(toolStatuses)
      .filter(([, status]) => status === 'complete')
      .map(([id]) => id)
    try {
      const result = await updateAttempt(currentAttemptId, {
        verdict_chosen: verdict,
        confidence,
        tools_used: completedTools
      })
      setScores(result.score_scroller, result.score_verifier, result.is_correct)
      setScreen('reveal')
    } catch (err) {
      console.error("Failed to submit attempt update:", err)
    }
  }

  const completedCount = Object.values(toolStatuses).filter((s) => s === 'complete').length

  if (loading) {
    return (
      <div className="h-screen bg-[#080d18] flex items-center justify-center">
        <span className="font-mono text-[11px] text-[#3d5a7a] tracking-[0.2em] animate-pulse">
          INITIALIZING FORENSIC TOOLKIT...
        </span>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#080d18] flex flex-col font-sans overflow-hidden">
      {/* Top bar */}
      <div className="bg-[#0a1020] border-b border-[#1e3a5f] px-5 h-11 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[15px] font-bold text-[#e8f0fe]">
            KONAN<span className="text-blue-500">//</span>NOISE
          </span>
          <div className="w-px h-3.5 bg-[#1e3a5f]" />
          <span className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.15em] uppercase">Verifier Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-[5px] items-center">
            {Object.keys(TOOLS).map((id) => (
              <div
                key={id}
                title={TOOLS[id].label}
                className="w-[7px] h-[7px] rounded-full transition-colors duration-300"
                style={{ background: toolStatuses[id] === 'complete' ? '#22c55e' : toolStatuses[id] === 'scanning' ? '#f59e0b' : '#1e3a5f' }}
              />
            ))}
            <span className="font-mono text-[9px] text-[#3d5a7a] ml-1">{completedCount}/6 tools</span>
          </div>
          <div className="w-px h-3.5 bg-[#1e3a5f]" />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] text-green-500">SCROLLER CONNECTED</span>
          </div>
          <div className="w-px h-3.5 bg-[#1e3a5f]" />
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-md px-2.5 py-[3px] flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-[#3d5a7a]">ROOM</span>
            <span className="font-mono text-[12px] font-bold text-blue-400">{roomCode ?? '------'}</span>
          </div>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '252px 1fr 292px' }}>
        {/* LEFT: Notes panel */}
        <div className="border-r border-[#1e3a5f] flex flex-col overflow-hidden">
          <div className="px-3.5 py-3 border-b border-[#1a2240] flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.18em] uppercase">Investigator Notes</span>
            <span className="font-mono text-[9px] text-[#1e3a5f]">{notes.length} chars</span>
          </div>
          <div className="flex-1 overflow-auto p-3 flex flex-col gap-2.5">
            <div className="bg-blue-500/[0.05] border border-blue-500/[0.14] rounded-lg p-3">
              <div className="font-mono text-[8px] text-blue-500 tracking-[0.18em] uppercase mb-1.5">
                Ask Scroller About:
              </div>
              {ASK_PROMPTS.map((q, i) => (
                <div key={i} className="font-mono text-[9px] text-[#3d5a7a] leading-[1.9] pl-2 border-l border-[#1e3a5f]">
                  → {q}
                </div>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Notes from Scroller...\n\nWhat did they describe?\n- Account:\n- Image:\n- Caption:\n- Suspicious?`}
              className="flex-1 min-h-[180px] bg-[#0a1020] border border-[#1a2240] rounded-lg px-3 py-2.5 font-mono text-[11px] text-[#a8c0e0] resize-none outline-none leading-[1.65]"
            />
          </div>
          <div className="px-3.5 py-2.5 border-t border-[#1a2240]">
            <SessionTimer />
          </div>
        </div>

        {/* CENTER: Toolkit */}
        <div className="flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1a2240] flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.18em] uppercase">
              Forensic Toolkit — Click any tool to run scan
            </span>
            <span className={`font-mono text-[9px] transition-colors duration-300 ${completedCount >= 3 ? 'text-green-500' : 'text-[#3d5a7a]'}`}>
              {completedCount >= 3
                ? `${completedCount} scans complete — ready to verdict`
                : 'Run at least 3 tools before submitting'}
            </span>
          </div>
          <div className="flex-1 overflow-auto p-3.5">
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {Object.keys(TOOLS).map((toolId) => {
                // Dynamically access tool outputs from fetched scenarioData JSON fields
                const toolData = scenarioData ? (scenarioData as any)[toolId] : undefined

                return (
                  <ToolCard
                    key={toolId}
                    toolId={toolId}
                    status={toolStatuses[toolId]}
                    scanProgress={scanProgress[toolId]}
                    onRun={runTool}
                    toolData={toolData}
                  />
                )
              })}
            </div>
            <div className="px-3.5 py-2.5 bg-amber-500/[0.05] border border-amber-500/[0.14] rounded-lg flex gap-2 items-start">
              <span className="text-amber-400 text-[13px] flex-shrink-0 mt-px">⚠</span>
              <span className="font-mono text-[10px] text-[#7a5a30] leading-[1.55]">
                You cannot see the social media post. Base all findings on tool results and your
                partner's verbal description. Red values indicate high-risk signals.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Verdict panel */}
        <div className="border-l border-[#1e3a5f] flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1a2240]">
            <span className="font-mono text-[9px] text-[#3d5a7a] tracking-[0.18em] uppercase">Submit Verdict</span>
          </div>
          <div className="flex-1 overflow-auto p-3.5 flex flex-col gap-2">
            <VerdictSelector verdict={verdict} onSelect={setVerdict} />

            <ConfidenceSlider value={confidence} onChange={setConfidence} />

            {completedCount < 3 && (
              <div className="px-3 py-2.5 bg-amber-500/[0.06] border border-amber-500/[0.18] rounded-lg font-mono text-[9px] text-[#7a5a30] leading-[1.55]">
                ⚠ Run at least 3 forensic tools before submitting for a reliable verdict.
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!verdict || submitting}
              className="rounded-[10px] py-4 font-mono text-[12px] font-bold tracking-[0.12em] uppercase transition-all duration-250 mt-1"
              style={{
                background: verdict && !submitting
                  ? VERDICT_CONFIG[verdict as NonNullVerdict].color
                  : '#1a2240',
                color: verdict && !submitting ? '#000' : '#2d4a6b',
                cursor: verdict && !submitting ? 'pointer' : 'not-allowed',
                boxShadow: verdict && !submitting
                  ? `0 4px 20px rgba(${VERDICT_CONFIG[verdict as NonNullVerdict].bg},0.35)`
                  : 'none',
              }}
            >
              {submitting
                ? '◉ Submitting...'
                : !verdict
                ? 'Select a verdict first'
                : `Submit: ${VERDICT_CONFIG[verdict as NonNullVerdict].label}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
