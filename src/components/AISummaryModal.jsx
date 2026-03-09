import React, { useState, useEffect, useCallback } from 'react';
import { summarizeArticle } from '../services/aiService';
import { timeAgo } from '../utils/helpers';

export default function AISummaryModal({ article, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const loadSummary = useCallback(async () => {
    if (!article) return;
    setLoading(true); setError(null); setData(null);
    try { setData(await summarizeArticle(article)); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [article]);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background:'rgba(3,3,8,0.92)', backdropFilter:'blur(20px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="glass-ultra rounded-2xl modal-in w-full overflow-hidden" style={{ maxWidth:'520px', maxHeight:'80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg,rgba(157,78,221,0.06),transparent)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize:'16px' }}>🤖</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em', color:'var(--text-1)' }}>AI SUMMARY</span>
            <span className="px-2 py-0.5 rounded-sm" style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.08em', background:'rgba(157,78,221,0.1)', color:'var(--violet)', border:'1px solid rgba(157,78,221,0.2)' }}>CLAUDE</span>
          </div>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight:'calc(80vh - 70px)' }}>
          <div className="px-5 py-4 flex flex-col gap-4">
            {/* Article info */}
            <div className="p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
              <p className="clamp-2" style={{ fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:600, color:'var(--text-1)', lineHeight:1.4, marginBottom:'6px' }}>
                {article.title}
              </p>
              <div className="flex items-center gap-3">
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)' }}>{article.source?.name}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)' }}>{timeAgo(article.publishedAt)}</span>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="live-pulse" />
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-3)', letterSpacing:'0.1em' }}>Claude is reading this article…</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="px-4 py-3 rounded-xl w-full" style={{ background:'rgba(255,0,0,0.06)', border:'1px solid rgba(255,0,0,0.15)' }}>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--red)', lineHeight:1.7 }}>⚠️ {error}</p>
                </div>
                <button onClick={loadSummary} className="btn-panic px-5 py-2 rounded-lg cursor-pointer"
                  style={{ fontFamily:'var(--font-display)', fontSize:'14px', letterSpacing:'0.08em' }}>
                  RETRY
                </button>
              </div>
            )}

            {data && !loading && (
              <>
                {/* Key fact */}
                {data.keyFact && (
                  <div className="p-3 rounded-xl" style={{ background:'rgba(157,78,221,0.06)', border:'1px solid rgba(157,78,221,0.15)' }}>
                    <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', color:'var(--violet)', marginBottom:'6px' }}>KEY FACT</p>
                    <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--text-1)', lineHeight:1.6 }}>{data.keyFact}</p>
                  </div>
                )}

                {/* Bullets */}
                <div>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', color:'var(--text-3)', marginBottom:'10px' }}>SUMMARY</p>
                  <div className="flex flex-col gap-3">
                    {(data.bullets || []).map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background:'var(--violet)' }} />
                        <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--text-2)', lineHeight:1.6 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Read time + link */}
                <div className="flex items-center justify-between pt-2" style={{ borderTop:'1px solid var(--border)' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-3)' }}>
                    ⏱ {data.readTime || 2} min read
                  </span>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--violet)', textDecoration:'none', letterSpacing:'0.08em' }}>
                      Read full article →
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
