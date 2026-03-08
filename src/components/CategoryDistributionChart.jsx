import React, { useEffect, useRef } from 'react';
import { CATEGORIES } from '../utils/constants';

export default function CategoryDistributionChart({ categoryNews }) {
  const canvasRef = useRef(null);

  // Derive stable data outside effect
  const data = CATEGORIES.map(cat => ({
    ...cat,
    count: (categoryNews[cat.id] || []).length,
  })).filter(d => d.count > 0);

  const total = data.reduce((s, d) => s + d.count, 0);
  // Stable primitive key to trigger effect only when counts change
  const countsKey = data.map(d => d.id + ':' + d.count).join(',');

  useEffect(() => {
    if (!canvasRef.current || data.length === 0 || total === 0) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const size   = 120;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2, r = size / 2 - 8, inner = r * 0.55;
    ctx.clearRect(0, 0, size, size);
    let angle = -Math.PI / 2;
    data.forEach(d => {
      const slice = (d.count / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = d.accent;
      ctx.shadowColor = d.accent;
      ctx.shadowBlur = 6;
      ctx.fill();
      angle += slice;
    });
    // Inner hole
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0f';
    ctx.shadowBlur = 0;
    ctx.fill();
  }, [countsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="mb-3" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555570' }}>
        🍩 Category Distribution
      </div>
      <div className="flex items-center gap-4">
        <canvas ref={canvasRef} style={{ flexShrink: 0, width: 120, height: 120 }} />
        <div className="flex flex-col gap-1.5 flex-1">
          {data.map(d => (
            <div key={d.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.accent, boxShadow: `0 0 4px ${d.accent}` }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#8888aa', letterSpacing: '0.04em' }}>{d.label}</span>
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: d.accent }}>
                {total > 0 ? Math.round((d.count / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
