import React from 'react';

export default function OfflineBanner({ online }) {
  if (online) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[400] flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{ transform:'translateX(-50%)', background:'#0a0a0f', border:'1px solid rgba(255,179,71,0.3)',
        boxShadow:'0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(255,179,71,0.1)', whiteSpace:'nowrap' }}>
      <div className="w-2 h-2 rounded-full" style={{ background:'#ffb347', boxShadow:'0 0 8px #ffb347' }} />
      <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'11px', letterSpacing:'0.08em', color:'#ffb347' }}>
        OFFLINE — Showing cached content
      </span>
    </div>
  );
}
