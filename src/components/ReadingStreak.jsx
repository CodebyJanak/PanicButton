import React from 'react';
import { useAppStore } from '../store/appStore';

export default function ReadingStreak() {
  const { state } = useAppStore();
  const { count, bestStreak } = state.readingStreak;
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
      style={{ background:'rgba(255,179,71,0.08)', border:'1px solid rgba(255,179,71,0.2)' }}>
      <span className="streak-flame" style={{ fontSize:'16px' }}>🔥</span>
      <div>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', color:'var(--amber)', letterSpacing:'0.05em' }}>{count}</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'rgba(255,179,71,0.6)', marginLeft:'4px' }}>DAY STREAK</span>
      </div>
      {bestStreak > count && (
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'7px', color:'var(--text-3)', borderLeft:'1px solid rgba(255,255,255,0.08)', paddingLeft:'8px' }}>
          BEST: {bestStreak}
        </span>
      )}
    </div>
  );
}
