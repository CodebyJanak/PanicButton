import React, { useState } from 'react';
import { generateDailyBriefing } from '../services/aiService';

export default function DailyBriefing({ isOpen, onClose, articles }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const generate = async () => {
    setLoading(true); setError(null);
    try { setData(await generateDailyBriefing(articles)); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background:'rgba(3,3,8,0.92)', backdropFilter:'blur(20px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="glass-ultra rounded-2xl modal-in w-full overflow-hidden" style={{ maxWidth:'600px', maxHeight:'80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg,rgba(255,179,71,0.06),transparent)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize:'20px' }}>📰</span>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'20px', letterSpacing:'0.12em', color:'var(--text-1)' }}>DAILY BRIEFING</p>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--amber)', letterSpacing:'0.12em' }}>
                {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight:'calc(80vh - 80px)' }}>
          <div className="px-6 py-5">
            {!data && !loading && (
              <div className="text-center py-8">
                <div style={{ fontSize:'48px', marginBottom:'16px' }}>🌅</div>
                <p style={{ fontFamily:'var(--font-ui)', fontWeight:600, fontSize:'18px', color:'var(--text-1)', marginBottom:'8px' }}>Good {getGreeting()}</p>
                <p className="mb-6" style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--text-2)', lineHeight:1.7 }}>
                  Claude will read today's top headlines and generate a personalized news briefing — just like having your own news anchor.
                </p>
                {error && <p className="mb-3" style={{ color:'var(--red)', fontFamily:'var(--font-mono)', fontSize:'9px' }}>{error}</p>}
                <button onClick={generate} className="btn-panic px-8 py-3 rounded-xl" style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em' }}>
                  GENERATE BRIEFING
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-10 gap-4">
                <div className="live-pulse" style={{ width:'12px', height:'12px' }} />
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)', letterSpacing:'0.1em' }}>Claude is reading today's news…</p>
              </div>
            )}

            {data && !loading && (
              <div className="flex flex-col gap-5">
                {/* Headline */}
                <div className="p-4 rounded-xl" style={{ background:'rgba(255,179,71,0.06)', border:'1px solid rgba(255,179,71,0.15)' }}>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--amber)', marginBottom:'8px' }}>TOP STORY</p>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(16px,3vw,22px)', letterSpacing:'0.04em', color:'var(--text-1)', lineHeight:1.2 }}>{data.headline}</p>
                </div>

                {/* Sections */}
                {(data.sections||[]).map((s,i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
                    <p style={{ fontFamily:'var(--font-display)', fontSize:'13px', letterSpacing:'0.12em', color:'var(--cyan)', marginBottom:'8px' }}>{s.category.toUpperCase()}</p>
                    <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--text-2)', lineHeight:1.7 }}>{s.summary}</p>
                  </div>
                ))}

                {/* Closing */}
                {data.closingNote && (
                  <div className="p-4 rounded-xl text-center" style={{ background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.1)' }}>
                    <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--cyan)', lineHeight:1.6, fontStyle:'italic' }}>"{data.closingNote}"</p>
                  </div>
                )}

                <button onClick={generate} className="btn-ghost px-4 py-2 rounded-lg text-center cursor-pointer"
                  style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.08em' }}>
                  ↺ Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
