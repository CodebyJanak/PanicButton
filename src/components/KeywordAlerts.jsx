import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function KeywordAlerts({ isOpen, onClose, matchedArticles }) {
  const { state, dispatch } = useAppStore();
  const [input, setInput] = useState('');

  const add = () => {
    const kw = input.trim().toLowerCase();
    if (!kw) return;
    dispatch({ type:'ALERT_ADD', keyword:kw });
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end pt-16"
      style={{ background:'rgba(3,3,8,0.6)', backdropFilter:'blur(8px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="panel-slide h-full flex flex-col" style={{ width:'360px', background:'var(--deep)', borderLeft:'1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em', color:'var(--text-1)' }}>🔔 KEYWORD ALERTS</span>
          </div>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar">
          {/* Add keyword */}
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.12em', color:'var(--text-3)', marginBottom:'8px' }}>ADD KEYWORD</p>
            <div className="flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}
                placeholder="e.g. earthquake, Apple, election…"
                className="flex-1 rounded-lg px-3 py-2 outline-none"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--text-1)', fontFamily:'var(--font-mono)', fontSize:'11px' }} />
              <button onClick={add} className="btn-panic px-3 py-2 rounded-lg"
                style={{ fontFamily:'var(--font-display)', fontSize:'14px', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>ADD</button>
            </div>
          </div>

          {/* Active alerts */}
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.12em', color:'var(--text-3)', marginBottom:'8px' }}>
              ACTIVE ALERTS ({state.keywordAlerts.length}/20)
            </p>
            {state.keywordAlerts.length === 0 ? (
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)', lineHeight:1.8 }}>
                No alerts set. Add keywords above to get notified when matching articles appear.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {state.keywordAlerts.map(kw => (
                  <span key={kw} className="keyword-tag">
                    {kw}
                    <button onClick={() => dispatch({ type:'ALERT_REMOVE', keyword:kw })}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,0,0,0.6)', fontSize:'12px', lineHeight:1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Matched articles */}
          {matchedArticles && matchedArticles.length > 0 && (
            <div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.12em', color:'var(--red)', marginBottom:'8px' }}>
                🔴 {matchedArticles.length} MATCHES TODAY
              </p>
              <div className="flex flex-col gap-2">
                {matchedArticles.slice(0,8).map((a,i) => (
                  <div key={i} className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ background:'rgba(255,0,0,0.05)', border:'1px solid rgba(255,0,0,0.12)' }}
                    onClick={() => window.open(a.url,'_blank')}>
                    <p className="clamp-2" style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-1)', lineHeight:1.4 }}>{a.title}</p>
                    <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--red)', marginTop:'4px' }}>
                      {a._matchedKeyword && `matched: "${a._matchedKeyword}"`} · {a.source?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
