import React, { useState, useEffect } from 'react';

export default function AutoRefreshBar({ enabled, intervalSeconds, onRefresh, newCount }) {
  const [secondsLeft, setSecondsLeft] = useState(intervalSeconds);
  const [pulse, setPulse] = useState(false);

  // Reset countdown when interval changes
  useEffect(() => {
    setSecondsLeft(intervalSeconds);
  }, [intervalSeconds]);

  // Countdown timer
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          onRefresh();
          return intervalSeconds;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, intervalSeconds, onRefresh]);

  // Pulse on new articles
  useEffect(() => {
    if (newCount > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 2000);
      return () => clearTimeout(t);
    }
  }, [newCount]);

  if (!enabled) return null;

  const pct = ((intervalSeconds - secondsLeft) / intervalSeconds) * 100;
  const fmtTime = s => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

  return (
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="h-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full transition-all duration-1000" style={{ width: `${pct}%`, background: 'rgba(255,0,0,0.5)' }} />
      </div>
      <div className="flex items-center justify-between px-6 py-1.5">
        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full ${pulse ? 'badge-pulse' : ''}`}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em',
                background: 'rgba(255,0,0,0.15)', color: '#FF0000', border: '1px solid rgba(255,0,0,0.3)' }}>
              +{newCount} NEW
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#555570', letterSpacing: '0.06em' }}>
            Auto-refresh in {fmtTime(secondsLeft)}
          </span>
          <button
            onClick={() => { setSecondsLeft(intervalSeconds); onRefresh(); }}
            className="cursor-pointer transition-all duration-150 hover:opacity-70"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#8888aa', background: 'none', border: 'none', letterSpacing: '0.06em', cursor: 'pointer' }}>
            ↻ Now
          </button>
        </div>
      </div>
    </div>
  );
}
