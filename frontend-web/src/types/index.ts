export type Screen =
  | 'landing'
  | 'scroller-lobby'
  | 'scroller-feed'
  | 'scroller-checklist'
  | 'scroller-wait'
  | 'verifier-lobby'
  | 'verifier-dashboard'
  | 'reveal'
  | 'score'

export type Role = 'scroller' | 'verifier' | null
export type Verdict = 'verified' | 'misleading' | 'fabricated' | null
export type ToolStatus = 'idle' | 'scanning' | 'complete'
