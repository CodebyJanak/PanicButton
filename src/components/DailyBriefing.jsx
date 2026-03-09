import React, { useState } from 'react';
import { generateDailyBriefing } from '../services/aiService';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

export default function DailyBriefing({ isOpen, onClose, articles }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const generate = async () => {
    setLoading(true); setError(null); setData(null);
    try {
      setData(await generateDailyBriefing(articles));
    } catch (e) {
      // Build a helpful error message
      const msg = e.message || 'Unknown error';
      let helpMsg = msg;
      if (msg.includes('GEMINI_API_KEY') || msg.includes('not configured')) {
        helpMsg = 'GEMINI_API_KEY is not set on your Render server.\n\n→ Go to Render → Environment → add GEMINI_API_KEY\n→ Get a free key at aistudio.google.com/apikey';
      } else if (msg.includes('404') || msg.includes('not found')) {
        helpMsg = 'AI proxy route missing. Push the updated server/index.js to GitHub.';
      } else if (msg.includes('invalid') || msg.includes('API_KEY_INVALID')) {
        helpMsg = 'Your Gemini API key is invalid. Get a new free key at aistudio.google.com/apikey';
      }
      setError(helpMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const hasArticles = articles && articles.length > 0;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(3,3,8,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-ultra rounded-2xl modal-in w-full overflow-hidden"
        style={{ maxWidth: '600px', maxHeight: '82vh' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,rgba(255,179,71,0.06),transparent)' }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '22px' }}>📰</span>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.12em', color: 'var(--text-1)' }}>DAILY BRIEFING</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--amber)', letterSpacing: '0.1em' }}>
                GEMINI AI · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px' }}>×</button>
        </div>

        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(82vh - 76px)' }}>
          <div className="px-6 py-5">

            {/* IDLE STATE */}
            {!data && !loading && (
              <div className="text-center py-6">
                <div style={{ fontSize: '52px', marginBottom: '16px' }}>🌅</div>
                <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '20px', color: 'var(--text-1)', marginBottom: '8px' }}>
                  Good {getGreeting()}
                </p>

                {!hasArticles ? (
                  <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.25)' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)', lineHeight: 1.8 }}>
                      ⏳ News is still loading. Wait a moment then try again.
                    </p>
                  </div>
                ) : (
                  <p className="mb-5" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>
                    Gemini AI will read today's <strong style={{ color: 'var(--text-1)' }}>{articles.length} articles</strong> and generate a personalized briefing.
                  </p>
                )}

                {/* Error */}
                {error && (
                  <div className="mb-5 px-4 py-3 rounded-xl text-left" style={{ background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--red)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      ❌ {error}
                    </p>
                  </div>
                )}

                <button
                  onClick={generate}
                  disabled={!hasArticles}
                  className="btn-panic px-10 py-3 rounded-xl disabled:opacity-40"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.1em', cursor: hasArticles ? 'pointer' : 'not-allowed' }}
                >
                  GENERATE BRIEFING
                </button>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center py-12 gap-4">
                <div className="live-pulse" style={{ width: '14px', height: '14px' }} />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.1em' }}>
                  Gemini is reading today's news…
                </p>
              </div>
            )}

            {/* RESULT */}
            {data && !loading && (
              <div className="flex flex-col gap-4">
                {/* Top story */}
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,179,71,0.07)', border: '1px solid rgba(255,179,71,0.2)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', color: 'var(--amber)', marginBottom: '8px' }}>TOP STORY</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,2.8vw,22px)', letterSpacing: '0.04em', color: 'var(--text-1)', lineHeight: 1.25 }}>
                    {data.headline}
                  </p>
                </div>

                {/* Sections */}
                {(data.sections || []).map((s, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.12em', color: 'var(--cyan)', marginBottom: '8px' }}>
                      {(s.category || '').toUpperCase()}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>{s.summary}</p>
                  </div>
                ))}

                {/* Closing */}
                {data.closingNote && (
                  <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--cyan)', lineHeight: 1.65, fontStyle: 'italic' }}>
                      "{data.closingNote}"
                    </p>
                  </div>
                )}

                <button
                  onClick={() => { setData(null); setError(null); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                >
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
