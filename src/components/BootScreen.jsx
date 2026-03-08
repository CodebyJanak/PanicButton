import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  'INITIALIZING INTELLIGENCE FEED…',
  'CONNECTING TO LIVE SOURCES…',
  'LOADING AI MODULES…',
  'SYSTEM READY.',
];

export default function BootScreen({ onDone }) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const intervals = BOOT_LINES.map((_, i) =>
      setTimeout(() => setLine(i+1), 800 + i * 600)
    );
    const done = setTimeout(onDone, 4000);
    return () => { intervals.forEach(clearTimeout); clearTimeout(done); };
  }, [onDone]);

  return (
    <div className="boot-screen">
      <div className="scanline" />
      <p className="boot-title text-gradient-red">PANIC</p>
      <p className="boot-title" style={{ color:'rgba(255,255,255,0.12)', marginTop:'-8px', fontSize:'clamp(14px,3vw,28px)', fontFamily:'var(--font-display)', letterSpacing:'0.4em' }}>
        BUTTON
      </p>
      <div style={{ marginTop:'20px', display:'flex', flexDirection:'column', gap:'6px', minHeight:'80px' }}>
        {BOOT_LINES.slice(0, line).map((l, i) => (
          <p key={i} className="boot-sub" style={{ opacity: i < line-1 ? 0.4 : 1 }}>
            {i < line-1 ? '✓' : '>'} {l}
          </p>
        ))}
      </div>
      <div className="boot-bar-bg">
        <div className="boot-bar" />
      </div>
      <p className="boot-status">PANIC BUTTON v3.0 — LIVE INTELLIGENCE FEED</p>
    </div>
  );
}
