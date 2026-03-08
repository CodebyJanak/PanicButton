import React, { useState, useEffect } from 'react';
import { analyzeSentiment } from '../services/aiService';

export default function SentimentMeter({ articles }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const articleCount = articles ? articles.length : 0;

  useEffect(() => {
    if (articleCount < 5) return;
    setLoading(true);
    setError(null);
    const headlines = (articles || []).map(a => a.title).filter(Boolean);
    analyzeSentiment(headlines)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [articleCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const moodColors = {
    positive: '#34d399', negative: '#FF0000', neutral: '#8888aa',
    anxious: '#f59e0b', hopeful: '#34d399', tense: '#FF0000', mixed: '#8888aa',
  };

  const tooFew = articleCount < 5;

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555570' }}>
          🧠 Global Mood Index
        </div>
        {data && (
          <div className="px-2 py-0.5 rounded-sm"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.1em',
              color: moodColors[data.mood?.toLowerCase()] || '#8888aa',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {data.mood?.toUpperCase() || 'NEUTRAL'}
          </div>
        )}
      </div>

      {tooFew && !loading && (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#555570' }}>
          Load more articles to analyze mood
        </p>
      )}
      {loading && (
        <div className="flex items-center gap-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#555570' }}>
          <div className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }} />
          Analyzing {articleCount} headlines with AI…
        </div>
      )}
      {error && !loading && (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#555570' }}>AI analysis unavailable</p>
      )}

      {data && !loading && !tooFew && (
        <>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#FF0000', letterSpacing: '0.06em' }}>NEGATIVE</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em',
                color: data.score > 0.1 ? '#34d399' : data.score < -0.1 ? '#FF0000' : '#8888aa' }}>
                {data.score > 0 ? '+' : ''}{(data.score * 100).toFixed(0)}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#34d399', letterSpacing: '0.06em' }}>POSITIVE</span>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000"
                style={{ width: `${50 + (data.score * 50)}%`,
                  background: data.score > 0.1 ? '#34d399' : data.score < -0.1 ? '#FF0000' : '#8888aa' }} />
              <div className="absolute top-0 bottom-0" style={{ left: '50%', width: '1px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Positive', val: data.positive, color: '#34d399' },
              { label: 'Negative', val: data.negative, color: '#FF0000' },
              { label: 'Neutral',  val: data.neutral,  color: '#555570' },
            ].map(s => (
              <div key={s.label} className="flex-1 text-center">
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.05em', color: s.color }}>{s.val}%</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '7px', color: '#555570', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {data.dominantTheme && (
            <div className="mt-2 text-center" style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#555570', letterSpacing: '0.06em' }}>
              Dominant theme: <span style={{ color: '#f0f0f5' }}>{data.dominantTheme}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
