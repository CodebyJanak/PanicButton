import React, { useState, useEffect } from 'react';
import { playAlertSound } from '../services/notificationService';

export default function BreakingOverlay({ article, onDismiss, notificationsEnabled }) {
  const [visible, setVisible] = useState(false);

  // We intentionally only re-run when article URL changes, not on every re-render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!article) return;
    setVisible(true);
    if (notificationsEnabled) playAlertSound();
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 600);
    }, 12000);
    return () => clearTimeout(t);
  }, [article?.url]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = () => { setVisible(false); setTimeout(onDismiss, 400); };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 pointer-events-none"
      style={{ transition: 'opacity 0.5s ease', opacity: visible ? 1 : 0 }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,0,0,0.08) 0%, transparent 70%)' }} />
      <div className="relative w-full pointer-events-auto rounded-2xl overflow-hidden"
        style={{ maxWidth: '600px', background: '#0a0a0f', border: '2px solid #FF0000',
          boxShadow: '0 0 80px rgba(255,0,0,0.5), 0 0 200px rgba(255,0,0,0.2)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'transform 0.5s ease' }}>
        <div className="panic-bar-animate h-1.5" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="badge-pulse px-3 py-1.5 rounded-md"
              style={{ background: '#FF0000', fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: 'white' }}>
              🚨 BREAKING NOW
            </div>
            {article.source?.name && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#8888aa', letterSpacing: '0.08em' }}>
                {article.source.name}
              </span>
            )}
            <button onClick={dismiss} className="ml-auto cursor-pointer"
              style={{ color: '#555570', background: 'none', border: 'none', fontSize: '22px', lineHeight: 1 }}>×</button>
          </div>
          {article.urlToImage && (
            <img src={article.urlToImage} alt="" className="w-full rounded-lg mb-4 object-cover" style={{ height: '180px' }}
              onError={e => { e.target.style.display = 'none'; }} />
          )}
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(20px,4vw,32px)', letterSpacing: '0.04em', color: '#f0f0f5', lineHeight: 1.1, marginBottom: '12px' }}>
            {article.title}
          </h2>
          {article.description && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#8888aa', lineHeight: 1.6, marginBottom: '16px' }}>
              {article.description.substring(0, 180)}…
            </p>
          )}
          <div className="flex gap-3">
            {article.url && (
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-md transition-all duration-200 hover:opacity-80"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: '#FF0000', color: 'white', textDecoration: 'none', boxShadow: '0 0 20px rgba(255,0,0,0.4)' }}>
                Read Full Story →
              </a>
            )}
            <button onClick={dismiss} className="py-2.5 px-5 rounded-md cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.05)', color: '#8888aa', border: '1px solid rgba(255,255,255,0.08)' }}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
