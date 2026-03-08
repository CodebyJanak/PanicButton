import React, { useState, useEffect } from 'react';
import { extractTrendingTopics } from '../services/aiService';

const CAT_COLORS = {
  politics: '#e879f9', tech: '#a78bfa', business: '#00d4ff', sports: '#34d399',
  health: '#fb7185', science: '#38bdf8', entertainment: '#f472b6', world: '#22d3ee',
  economy: '#4ade80', default: '#8888aa',
};

export default function TrendingTopics({ articles }) {
  const [topics,  setTopics]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode]       = useState('cloud');
  const articleCount = articles ? articles.length : 0;

  useEffect(() => {
    if (!articles || articles.length < 5) return;
    setLoading(true);
    extractTrendingTopics(articles)
      .then(t => { setTopics(t.slice(0, 20)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [articleCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const maxCount = Math.max(...topics.map(t => t.count), 1);

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555570' }}>
          📊 Trending Topics
        </div>
        <div className="flex gap-1">
          {['cloud', 'bars'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-2 py-0.5 rounded cursor-pointer transition-all duration-150"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.06em',
                background: mode === m ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: '1px solid ' + (mode === m ? 'rgba(255,255,255,0.1)' : 'transparent'),
                color: mode === m ? '#f0f0f5' : '#555570', cursor: 'pointer' }}>
              {m === 'cloud' ? '☁' : '▬'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#555570' }}>
          <div className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }} />
          Extracting topics with AI…
        </div>
      )}
      {!loading && topics.length === 0 && (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#555570' }}>Load news to see trending topics</p>
      )}

      {!loading && topics.length > 0 && mode === 'cloud' && (
        <div className="flex flex-wrap gap-2">
          {topics.map((t, i) => {
            const size = 9 + Math.round((t.count / maxCount) * 10);
            const color = CAT_COLORS[t.category?.toLowerCase()] || CAT_COLORS.default;
            return (
              <span key={i} className="px-2 py-0.5 rounded-md cursor-default"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: `${size}px`, letterSpacing: '0.04em',
                  color, background: `${color}10`, border: `1px solid ${color}20`,
                  opacity: 0.7 + (t.count / maxCount * 0.3) }}>
                {t.word}
              </span>
            );
          })}
        </div>
      )}

      {!loading && topics.length > 0 && mode === 'bars' && (
        <div className="flex flex-col gap-1.5">
          {topics.slice(0, 10).map((t, i) => {
            const color = CAT_COLORS[t.category?.toLowerCase()] || CAT_COLORS.default;
            const pct = (t.count / maxCount) * 100;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color, minWidth: '4px', boxShadow: `0 0 6px ${color}` }} />
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.04em', color, minWidth: '90px' }}>{t.word}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '7px', color: '#555570', minWidth: '20px', textAlign: 'right' }}>{t.count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
