import React from 'react';

interface RoleCardProps {
  roleId: string;
  title: string;
  number: string;
  description: string;
  device: string;
  icon: React.ReactNode;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

export function RoleCard({
  title,
  number,
  description,
  device,
  icon,
  hovered,
  onHover,
  onClick,
}: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`
        relative overflow-hidden w-[310px] text-left p-8 rounded-[18px] cursor-pointer 
        transition-all duration-250 ease-out backdrop-blur-md outline-none
        ${hovered 
          ? 'bg-blue-500/10 border-blue-400/55 shadow-[0_0_50px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(96,165,250,0.1)]' 
          : 'bg-[#0f1629]/90 border-[#1e3a5f] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
        } border
      `}
    >
      {/* Corner accent */}
      {hovered && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
      )}

      {/* Icon */}
      <div
        className={`
          w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-5 transition-all duration-250 border
          ${hovered ? 'bg-blue-500/20 border-blue-400/40' : 'bg-blue-500/10 border-blue-500/20'}
        `}
      >
        {icon}
      </div>

      <div className="font-mono text-[10px] text-blue-500 tracking-[0.25em] uppercase mb-2">
        Role {number}
      </div>

      <div className="font-mono text-xl font-bold text-[#e8f0fe] mb-3.5 tracking-tight">
        {title}
      </div>

      <div className="text-[13px] text-[#7a96b8] leading-relaxed mb-6">
        {description}
      </div>

      <div className="flex items-center gap-[7px] pt-5 border-t border-[#1a2240]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="#2d5a8f" strokeWidth="1" />
          <circle cx="6" cy="6" r="2" fill="#2d5a8f" />
        </svg>
        <span className="font-mono text-[10px] text-[#2d5a8f] tracking-[0.1em]">
          {device}
        </span>
      </div>
    </button>
  );
}
