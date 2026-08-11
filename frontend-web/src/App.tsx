import { useGameStore } from "./store/gameStore";
import { LandingPage } from "./pages/LandingPage";
import { ScrollerFeedPage } from "./pages/scroller/ScrollerFeedPage";
import { ScrollerChecklistPage } from "./pages/scroller/ScrollerChecklistPage";
import { ScrollerLobbyPage } from "./pages/scroller/ScrollerLobbyPage";
import { ScrollerWaitPage } from "./pages/scroller/ScrollerWaitPage";
import { VerifierDashboardPage } from "./pages/verifier/VerifierDashboardPage";
import { VerifierLobbyPage } from "./pages/verifier/VerifierLobbyPage";
import { ScorePage } from "./pages/ScorePage";
import { RevealPage } from "./pages/RevealPage";

export default function App() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case 'landing': return <LandingPage />
    case 'scroller-lobby': return <ScrollerLobbyPage />
    case 'scroller-feed': return <ScrollerFeedPage />
    case 'scroller-checklist': return <ScrollerChecklistPage />
    case 'scroller-wait': return <ScrollerWaitPage />
    case 'verifier-lobby': return <VerifierLobbyPage />
    case 'verifier-dashboard': return <VerifierDashboardPage />
    case 'reveal': return <RevealPage />
    case 'score': return <ScorePage />
    default: return null;
  }
}