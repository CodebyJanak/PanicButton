import React, { useState, useRef, useEffect } from 'react';
import { chatWithNews } from '../services/aiService';

const SUGGESTED = [
  'What happened today?',
  'Any breaking news?',
  'Summarize tech news',
  "What's trending?",
];

export default function AskNewsChat({ isOpen, onClose, articles }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I've read today's headlines. Ask me anything about current events." }
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg];
      const reply = await chatWithNews(q, articles || [], history);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      // Show the REAL error so the user knows what's wrong
      const errText = e.message || 'Unknown error';
      let helpMsg = `⚠️ Error: ${errText}`;
      if (errText.includes('GEMINI_API_KEY') || errText.includes('not configured')) {
        helpMsg = '❌ GEMINI_API_KEY is not set on Render.\n\nFix: Go to Render → your service → Environment → Add variable:\nGEMINI_API_KEY = your key\n\nGet a free key at: aistudio.google.com/apikey';
      } else if (errText.includes('404') || errText.includes('not found')) {
        helpMsg = '❌ The AI proxy route is missing from server.js on GitHub.\n\nYou need to push the updated server/index.js file to your GitHub repo.';
      } else if (errText.includes('API_KEY_INVALID') || errText.includes('invalid')) {
        helpMsg = '❌ Your GEMINI_API_KEY is invalid.\n\nGet a new free key at: aistudio.google.com/apikey\nThen update it in Render → Environment.';
      }
      setMessages(prev => [...prev, { role: 'assistant', content: helpMsg }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(3,3,8,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-ultra rounded-2xl modal-in flex flex-col w-full"
        style={{ maxWidth: '560px', height: '70vh', maxHeight: '620px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'rgba(157,78,221,0.15)', border: '1px solid rgba(157,78,221,0.3)' }}
          >🤖</div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '14px', color: 'var(--text-1)' }}>Ask The News</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--violet)', letterSpacing: '0.1em' }}>
              GEMINI AI · {articles?.length || 0} ARTICLES LOADED
            </p>
          </div>
          <button onClick={onClose} className="ml-auto" style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}>×</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[88%] px-4 py-3 rounded-2xl ${m.role === 'user' ? 'ml-auto' : ''}`}
              style={{
                background: m.role === 'user'
                  ? 'linear-gradient(135deg, rgba(157,78,221,0.25), rgba(157,78,221,0.1))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${m.role === 'user' ? 'rgba(157,78,221,0.3)' : 'var(--border)'}`,
              }}
            >
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-1)',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
              }}>{m.content}</p>
            </div>
          ))}

          {loading && (
            <div
              className="max-w-[88%] px-4 py-4 rounded-2xl flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <span key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--violet)', display: 'block',
                  animation: `pulse 1s ${delay}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 rounded-full cursor-pointer"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.05em',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  color: 'var(--text-2)', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(157,78,221,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about today's news…"
            disabled={loading}
            className="flex-1 outline-none rounded-xl px-4 py-2"
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              color: 'var(--text-1)', fontFamily: 'var(--font-body)', fontSize: '13px',
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn-panic px-4 py-2 rounded-xl disabled:opacity-40"
            style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.05em', cursor: 'pointer' }}
          >SEND</button>
        </div>
      </div>
    </div>
  );
}
