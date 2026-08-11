import { useState } from 'react';
import { RoleCard } from '../components/ui/RoleCard';
import { useGameStore } from '../store/gameStore';

export function LandingPage() {
  const [hovered, setHovered] = useState<'scroller' | 'verifier' | null>(null);
  const { setRole, setScreen } = useGameStore();

  const handleSelectRole = (role: 'scroller' | 'verifier') => {
    setRole(role);
    setScreen(role === 'scroller' ? 'scroller-lobby' : 'verifier-lobby');
  };

  return (
    <div className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center font-sans relative overflow-hidden py-10 px-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Central glow */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.1)_0%,transparent_65%)] pointer-events-none" />

      {/* Header */}
      <div className="relative text-center mb-[52px]">

        <h1 className="font-mono text-[clamp(52px,8vw,92px)] font-bold text-[#e8f0fe] m-0 mb-3 tracking-[-0.03em] leading-none">
          KONAN
        </h1>

        <p className="font-sans text-[15px] text-[#6b82a8] m-0 tracking-[0.1em] uppercase">
          A cooperative media literacy investigation game
        </p>
      </div>

      {/* Role cards */}
      <div className="flex gap-5 relative flex-wrap justify-center z-10">
        <RoleCard
          roleId="scroller"
          title="THE SCROLLER"
          number="01"
          description="You see the social media post. Your partner cannot. Describe what you observe — account details, image, caption — accurately and without bias."
          device="Designed for mobile device"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="2" width="12" height="20" rx="3" stroke="#60a5fa" strokeWidth="1.5" />
              <circle cx="12" cy="18" r="1" fill="#60a5fa" />
            </svg>
          }
          hovered={hovered === 'scroller'}
          onHover={(h) => setHovered(h ? 'scroller' : null)}
          onClick={() => handleSelectRole('scroller')}
        />

        <RoleCard
          roleId="verifier"
          title="THE VERIFIER"
          number="02"
          description="You have the forensic tools. You cannot see the post. Run digital investigations based on your partner's verbal description, then submit your verdict."
          device="Designed for desktop/laptop"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="13" rx="2" stroke="#60a5fa" strokeWidth="1.5" />
              <path d="M8 21h8M12 17v4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          hovered={hovered === 'verifier'}
          onHover={(h) => setHovered(h ? 'verifier' : null)}
          onClick={() => handleSelectRole('verifier')}
        />
      </div>

      {/* Footer */}
      <div className="mt-12 text-center relative z-10">
        <div className="font-mono text-[11px] text-[#1e3a5f] tracking-[0.2em] uppercase">
          ◎ Round 1 of 3 — Climate Series — Difficulty: Advanced
        </div>
        <div className="mt-2 font-mono text-[11px] text-[#2d4a6b] tracking-[0.1em]">
          Two players required — communicate verbally — do not share screens
        </div>
      </div>
    </div>
  );
}
