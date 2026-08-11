import { useState } from 'react'
import { RoleBadge } from '../../components/scroller/RoleBadge'
import { ObservationChecklist } from '../../components/scroller/ObservationChecklist'
import { DescriptionRatingSliders } from '../../components/scroller/DescriptionRatingSliders'
import { useGameStore } from '../../store/gameStore'
import { submitAttempt } from '../../services/api'

const CHECK_ITEMS = [
  { id: 'account_name', label: 'Account name & handle' },
  { id: 'follower_count', label: 'Follower / following count' },
  { id: 'verification_badge', label: 'Verification badge status' },
  { id: 'post_type', label: 'Post type (photo / video / text)' },
  { id: 'image_content', label: 'Image content description' },
  { id: 'caption_claims', label: 'Caption key claims' },
  { id: 'hashtags', label: 'Hashtags & keywords used' },
  { id: 'anomalies', label: 'Any suspicious anomalies' },
]

export function ScrollerChecklistPage() {
  const { setScreen, scenarioId, roomId } = useGameStore()

  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECK_ITEMS.map((i) => [i.id, false]))
  )
  const [precision, setPrecision] = useState(3)
  const [neutrality, setNeutrality] = useState(3)
  const [completeness, setCompleteness] = useState(3)

  const average = ((precision + neutrality + completeness) / 3).toFixed(1)

  const handleSubmit = async () => {
    try {
      await submitAttempt({
        room: roomId!,
        round: null,
        scenario: scenarioId ?? 1,
        verdict_chosen: null, // Scroller leaves this null
        confidence: 3,
        checklist_account_name: checks['account_name'],
        checklist_account_age:  checks['follower_count'],
        checklist_post_type:    checks['post_type'],
        checklist_claim:        checks['caption_claims'],
        checklist_anomalies:    checks['anomalies'],
        tools_used: [],
        followed_recommendation: null,
        description_neutrality:        neutrality,
        description_anomaly_awareness: checks['anomalies'] ? 4 : 2,
        description_completeness:      completeness,
        description_precision:         precision,
      })

      setScreen('scroller-wait')
    } catch (err) {
      console.error('Failed to submit attempt:', err)
    }
    
  }
      
  return (
    <div className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center font-sans relative px-4 py-6"
      style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
    >
      <div className="relative w-full max-w-[440px]">
        <RoleBadge label="Scroller — Phase 2 / 3" />

        <div className="mb-6">
          <h2 className="font-mono text-[22px] font-bold text-[#e8f0fe] mb-1.5">Observation Checklist</h2>
          <p className="text-[13px] text-[#6b82a8]">Mark everything you included in your description to the Verifier.</p>
        </div>

        <ObservationChecklist
          items={CHECK_ITEMS}
          checks={checks}
          onToggle={(id) => setChecks((c) => ({ ...c, [id]: !c[id] }))}
        />

        <DescriptionRatingSliders
          sliders={[
            { label: 'Precision', value: precision, onChange: setPrecision },
            { label: 'Neutrality', value: neutrality, onChange: setNeutrality },
            { label: 'Completeness', value: completeness, onChange: setCompleteness },
          ]}
          average={average}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white rounded-xl py-4 font-mono text-[13px] font-bold tracking-[0.12em] uppercase cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:bg-blue-400 transition-colors"
        >
          Submit & Wait for Verifier →
        </button>
      </div>
    </div>
  )
}
