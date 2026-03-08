import React, { useState } from 'react';
import { checkFakeNews } from '../services/aiService';

const CRED_CONFIG = {
  high:       { color:'#00ff88', icon:'✅', label:'Credible',    bg:'rgba(0,255,136,0.1)'  },
  medium:     { color:'#ffb347', icon:'⚠️', label:'Uncertain',   bg:'rgba(255,179,71,0.1)' },
  low:        { color:'#ef4444', icon:'🚩', label:'Questionable', bg:'rgba(239,68,68,0.1)' },
  suspicious: { color:'#FF0000', icon:'❌', label:'Suspicious',   bg:'rgba(255,0,0,0.12)'  },
  unknown:    { color:'#555570', icon:'❓', label:'Unknown',      bg:'rgba(85,85,112,0.1)' },
};

export default function FakeNewsChecker({ article, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const check = async () => {
    setLoading(true); setError(null);
    try { setData(await checkFakeNews(article)); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (!article) return null;
  const cfg = data ? (CRED_CONFIG[data.credibility]||CRED_CONFIG.unknown) : null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background:'rgba(3,3,8,0.9)', backdropFilter:'blur(20px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="glass-ultra rounded-2xl modal-in w-full" style={{ maxWidth:'480px' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em', color:'var(--text-1)' }}>FACT CHECK</span>
            <span className="px-2 py-0.5 rounded-sm" style={{ fontFamily:'var(--font-mono)', fontSize:'8px', background:'rgba(0,255,136,0.1)', color:'var(--green)', border:'1px solid rgba(0,255,136,0.2)' }}>AI POWERED</span>
          </div>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        <div className="px-5 py-4">
          <p className="clamp-2 mb-4" style={{ fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:600, color:'var(--text-1)', lineHeight:1.4 }}>{article.title}</p>

          {!data && !loading && (
            <div className="text-center py-6">
              <p className="mb-4" style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)', letterSpacing:'0.06em', lineHeight:1.8 }}>
                Claude will evaluate this article for credibility indicators, suspicious language patterns, and known misinformation markers.
              </p>
              {error && <p className="mb-3" style={{ color:'var(--red)', fontFamily:'var(--font-mono)', fontSize:'9px' }}>{error}</p>}
              <button onClick={check} className="btn-panic px-6 py-2.5 rounded-lg" style={{ fontFamily:'var(--font-display)', fontSize:'16px', letterSpacing:'0.08em' }}>
                CHECK CREDIBILITY
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="live-pulse" />
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-3)', letterSpacing:'0.08em' }}>Fact-checking with AI…</p>
            </div>
          )}

          {data && !loading && (
            <>
              <div className="flex items-center justify-center mb-4">
                <div className="px-6 py-3 rounded-xl" style={{ background:cfg.bg, border:`1px solid ${cfg.color}40` }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:'24px', letterSpacing:'0.08em', color:cfg.color }}>
                    {cfg.icon} {cfg.label.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)' }}>Credibility Score</span>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:'16px', color:cfg.color }}>{Math.round((data.score||0)*100)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width:`${(data.score||0)*100}%`, background:cfg.color, boxShadow:`0 0 10px ${cfg.color}` }} />
                </div>
              </div>

              {/* Flags */}
              {data.flags && data.flags.length > 0 && (
                <div className="mb-3">
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', letterSpacing:'0.1em', marginBottom:'8px' }}>FLAGS DETECTED</p>
                  <div className="flex flex-wrap gap-2">
                    {data.flags.map((f,i) => (
                      <span key={i} className="px-2 py-1 rounded-md" style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'#ef4444', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>
                        ⚑ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-2)', lineHeight:1.6 }}>💬 {data.verdict}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
