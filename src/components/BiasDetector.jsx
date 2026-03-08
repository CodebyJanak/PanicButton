import React, { useState } from 'react';
import { detectBias } from '../services/aiService';

const BIAS_CONFIG = {
  left:      { color:'#3b82f6', label:'Left-Leaning',  icon:'◀' },
  center:    { color:'#8888aa', label:'Center',         icon:'◆' },
  right:     { color:'#ef4444', label:'Right-Leaning',  icon:'▶' },
  unknown:   { color:'#555570', label:'Unrated',        icon:'?' },
};

export default function BiasDetector({ article, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const analyze = async () => {
    setLoading(true); setError(null);
    try {
      const result = await detectBias(article);
      setData(result);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (!article) return null;

  const cfg = data ? (BIAS_CONFIG[data.bias] || BIAS_CONFIG.unknown) : null;
  const leanPct = data ? 50 + (data.political_leaning||0)*50 : 50;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background:'rgba(3,3,8,0.9)', backdropFilter:'blur(20px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="glass-ultra rounded-2xl modal-in w-full" style={{ maxWidth:'500px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize:'16px' }}>⚖️</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em', color:'var(--text-1)' }}>BIAS DETECTOR</span>
            <span className="px-2 py-0.5 rounded-sm" style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.08em', background:'rgba(157,78,221,0.1)', color:'var(--violet)', border:'1px solid rgba(157,78,221,0.2)' }}>CLAUDE AI</span>
          </div>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        <div className="px-5 py-4">
          {/* Article title */}
          <p className="clamp-2 mb-4" style={{ fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:600, color:'var(--text-1)', lineHeight:1.4 }}>{article.title}</p>

          {!data && !loading && (
            <div className="text-center py-6">
              <p className="mb-4" style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)', letterSpacing:'0.06em', lineHeight:1.7 }}>
                Claude will analyze the political leaning of this article based on language, framing, and source.
              </p>
              {error && <p className="mb-3" style={{ color:'var(--red)', fontFamily:'var(--font-mono)', fontSize:'9px' }}>{error}</p>}
              <button onClick={analyze} className="btn-panic px-6 py-2.5 rounded-lg" style={{ fontFamily:'var(--font-display)', fontSize:'16px', letterSpacing:'0.08em' }}>
                ANALYZE BIAS
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="live-pulse" />
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-3)', letterSpacing:'0.08em' }}>Analyzing political framing…</p>
            </div>
          )}

          {data && !loading && (
            <>
              {/* Bias result */}
              <div className="flex items-center justify-center mb-5">
                <div className="px-6 py-3 rounded-xl" style={{ background:`${cfg.color}15`, border:`1px solid ${cfg.color}40` }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:'28px', letterSpacing:'0.1em', color:cfg.color }}>{cfg.icon} {cfg.label.toUpperCase()}</span>
                </div>
              </div>

              {/* Spectrum bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'#3b82f6' }}>◀ LEFT</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'#8888aa' }}>CENTER</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'#ef4444' }}>RIGHT ▶</span>
                </div>
                <div className="bias-track relative">
                  <div className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 -translate-x-1/2 border-2"
                    style={{ left:`${leanPct}%`, background:'white', borderColor:cfg.color, boxShadow:`0 0 10px ${cfg.color}`, transition:'left 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
                <div className="flex justify-end mt-1">
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)' }}>
                    Confidence: {Math.round((data.confidence||0)*100)}%
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <div className="p-3 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-2)', lineHeight:1.6 }}>
                  💬 {data.reasoning}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
