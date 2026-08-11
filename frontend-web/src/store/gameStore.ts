import { create } from 'zustand'
import type { Screen, Role, Verdict } from '../types'

export interface ScrollerData {
  checklist_account_name: boolean
  checklist_account_age: boolean
  checklist_post_type: boolean
  checklist_claim: boolean
  checklist_anomalies: boolean
  description_neutrality: number
  description_anomaly_awareness: number
  description_completeness: number
  description_precision: number
}

interface GameState {
  // navigation
  screen: Screen
  role: Role

  // room
  roomId: number | null
  roomCode: string | null

  // scenario
  scenarioId: number | null

  // verdict
  teamVerdict: Verdict

  // scroller's checklist + ratings — stored here so Verifier can include them in submitAttempt
  scrollerData: ScrollerData | null

  // scores from backend (set after submitAttempt)
  scoreScroller: number | null
  scoreVerifier: number | null
  isCorrect: boolean | null

  // actions
  setScreen: (screen: Screen) => void
  setRole: (role: Role) => void
  setRoom: (id: number, code: string) => void
  setScenarioId: (id: number) => void
  setTeamVerdict: (verdict: Verdict) => void
  setScrollerData: (data: ScrollerData) => void
  setScores: (scroller: number, verifier: number, correct: boolean) => void
  resetGame: () => void
  nextRound: (scenarioId: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'landing',
  role: null,
  roomId: null,
  roomCode: null,
  scenarioId: null,
  teamVerdict: null,
  scrollerData: null,
  scoreScroller: null,
  scoreVerifier: null,
  isCorrect: null,

  setScreen: (screen) => set({ screen }),
  setRole: (role) => set({ role }),
  setRoom: (roomId, roomCode) => set({ roomId, roomCode }),
  setScenarioId: (scenarioId) => set({ scenarioId }),
  setTeamVerdict: (teamVerdict) => set({ teamVerdict }),
  setScrollerData: (scrollerData) => set({ scrollerData }),
  setScores: (scoreScroller, scoreVerifier, isCorrect) =>
    set({ scoreScroller, scoreVerifier, isCorrect }),
  resetGame: () =>
    set({
      screen: 'landing',
      role: null,
      roomId: null,
      roomCode: null,
      scenarioId: null,
      teamVerdict: null,
      scrollerData: null,
      scoreScroller: null,
      scoreVerifier: null,
      isCorrect: null,
    }),
  nextRound: (scenarioId) => {
    set((state) => ({
      // Keep room connection and role
      screen: state.role === 'scroller' ? 'scroller-feed' : 'verifier-dashboard',
      scenarioId,

      //clear round
      teamVerdict: null, // new round — reset verdict
      scrollerData: null, // reset checklist + ratings
      scoreScroller: null,
      scoreVerifier: null,
      isCorrect: null,
    }))
  }
}))