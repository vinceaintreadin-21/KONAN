import { useState, useEffect } from 'react'

export function SessionTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return (
    <div className="flex justify-between items-center">
      <span className="font-mono text-[9px] text-[#1e3a5f] tracking-[0.15em] uppercase">Session</span>
      <span className="font-mono text-sm text-[#2d4a6b]">{mm}:{ss}</span>
    </div>
  )
}

