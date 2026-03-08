import React, { useState, useEffect, useCallback } from 'react';
import { summarizeArticle } from '../services/aiService';
import { timeAgo } from '../utils/helpers';

export default function AISummaryModal({ article, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const loadSummary = useCallback(async () => {
    if (!article) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await summarizeArticle(article);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [article]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full rounded-2xl overflow-hidden"
        style={{ maxWidth: '560px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '16px' }}>🤖</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.1em', color: '#a78bfa' }}>AI SUMMARY</span>
            <span className="px-2 py-0.5 rounded-sm"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.08em',
                background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
              CLAUDE
            </span>
          </div>
          <button onClick={onClose} style={{ color: '#555570', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>

        {/* Article info */}
        <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {article.urlToImage && (
            <img src={article.urlToImage} alt="" className="w-full rounded-lg mb-3 object-cover" style={{ height: '160px' }}
              onError={e => { e.target.style.display = 'none'; }} />
          )}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#f0f0f5', lineHeight: 1.4, marginBottom: '6px' }}>
            {article.title}
          </p>
          <div className="flex items-center gap-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#555570', letterSpacing: '0.06em' }}>
            <span>{article.source?.name || 'Unknown'}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="px-5 py-4">
          {loading && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#a78bfa' }}>
                <div className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }} />
                Claude is reading this article…
              </div>
              {[90, 75, 85].map((w, i) => (
                <div key={i} className="skeleton-shimmer rounded" style={{ height: '12px', width: `${w}%` }} />
              ))}
            </div>
          )}
          {error && !loading && (
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#555570', lineHeight: 1.7 }}>
              AI summary unavailable — {error.includes('API') ? 'check your Claude API key' : 'try again later'}.
            </p>
          )}
          {data && !loading && (
            <>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555570', marginBottom: '12px' }}>
                TL;DR — {data.readTime || 1} min read
              </div>
              <ul className="flex flex-col gap-3">
                {(data.bullets || []).map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px' }}>
                      {String.fromCharCode(9312 + i)}
                    </span>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#d0d0e0', lineHeight: 1.6 }}>{b}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#555570', letterSpacing: '0.04em' }}>Powered by Claude AI</span>
          {article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-md transition-all duration-200 hover:opacity-80"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'white', background: '#FF0000', textDecoration: 'none', boxShadow: '0 0 14px rgba(255,0,0,0.3)' }}>
              Read Full →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
