import React, { useState } from 'react';

export default function PublicationTimeline({ articles, onArticleClick }) {
  const [hovered, setHovered] = useState(null);
  if (!articles || articles.length === 0) return null;

  // Group by hour
  const now = new Date();
  const hours = {};
  articles.forEach(a => {
    if (!a.publishedAt) return;
    const d = new Date(a.publishedAt);
    if (isNaN(d)) return;
    const diffH = Math.floor((now - d) / 3600000);
    if (diffH > 23) return;
    const key = diffH;
    if (!hours[key]) hours[key] = [];
    hours[key].push(a);
  });

  const maxH = 24;
  const maxCount = Math.max(...Object.values(hours).map(a => a.length), 1);
  const slots = Array.from({ length: maxH }, (_, i) => ({ h: i, articles: hours[i] || [] }));

  return (
    <div className="rounded-xl p-4" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="mb-3" style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'#555570' }}>
        📅 Publication Timeline (Last 24h)
      </div>
      <div className="flex items-end gap-0.5" style={{ height:'60px' }}>
        {slots.map(({ h, articles: arts }) => {
          const height = arts.length > 0 ? Math.max(8, (arts.length / maxCount) * 52) : 3;
          const isNow = h === 0;
          return (
            <div key={h} className="flex-1 flex flex-col items-center justify-end cursor-pointer group relative"
              onMouseEnter={() => setHovered(h)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => arts[0] && onArticleClick && onArticleClick(arts[0])}>
              <div className="w-full rounded-t transition-all duration-300"
                style={{ height:`${height}px`, background: arts.length > 0
                  ? `rgba(255,${isNow?0:60},${isNow?0:60},${0.3 + (arts.length/maxCount)*0.7})`
                  : 'rgba(255,255,255,0.04)',
                  boxShadow: arts.length > 0 ? `0 0 ${4+arts.length*2}px rgba(255,0,0,0.3)` : 'none',
                }} />
              {hovered === h && arts.length > 0 && (
                <div className="absolute bottom-full mb-1 z-10 pointer-events-none"
                  style={{ background:'#0a0a0f', border:'1px solid rgba(255,0,0,0.3)', borderRadius:'6px',
                    padding:'6px 10px', whiteSpace:'nowrap', left:'50%', transform:'translateX(-50%)' }}>
                  <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'8px', color:'#FF0000', letterSpacing:'0.06em' }}>
                    {h === 0 ? 'Now' : `${h}h ago`}: {arts.length} articles
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'7px', color:'#555570' }}>NOW</span>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'7px', color:'#555570' }}>24H AGO</span>
      </div>
    </div>
  );
}
