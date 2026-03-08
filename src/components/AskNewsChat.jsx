import React, { useState, useRef, useEffect } from 'react';
import { chatWithNews } from '../services/aiService';

export default function AskNewsChat({ isOpen, onClose, articles }) {
  const [messages, setMessages] = useState([
    { role:'assistant', content:'Hey! I\'ve read today\'s top headlines. Ask me anything about current events.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    const userMsg = { role:'user', content:q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = messages.slice(-8);
      const reply = await chatWithNews(q, articles, history);
      setMessages(prev => [...prev, { role:'assistant', content:reply }]);
    } catch(e) {
      setMessages(prev => [...prev, { role:'assistant', content:'Sorry, I couldn\'t process that. Try again.' }]);
    } finally { setLoading(false); }
  };

  const SUGGESTED = ['What happened today?','Any breaking news?','Summarize business news','What\'s trending in tech?'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4"
      style={{ background:'rgba(3,3,8,0.85)', backdropFilter:'blur(20px)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="glass-ultra rounded-2xl modal-in flex flex-col w-full" style={{ maxWidth:'560px', height:'70vh', maxHeight:'600px' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background:'rgba(157,78,221,0.15)', border:'1px solid rgba(157,78,221,0.3)' }}>🤖</div>
          <div>
            <p style={{ fontFamily:'var(--font-ui)', fontWeight:700, fontSize:'14px', color:'var(--text-1)' }}>Ask The News</p>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--violet)', letterSpacing:'0.1em' }}>POWERED BY CLAUDE AI</p>
          </div>
          <button onClick={onClose} className="ml-auto" style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar">
          {messages.map((m,i) => (
            <div key={i} className={`max-w-[85%] px-4 py-3 ${m.role==='user'?'chat-msg-user ml-auto':'chat-msg-ai'}`}>
              <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--text-1)', lineHeight:1.6 }}>{m.content}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-msg-ai max-w-[85%] px-4 py-3 flex items-center gap-2 chat-typing">
              <span/><span/><span/>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => { setInput(s); }}
                className="px-3 py-1.5 rounded-full cursor-pointer transition-all hover:opacity-80"
                style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.05em', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--text-2)' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 flex gap-2" style={{ borderTop:'1px solid var(--border)' }}>
          <input
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && send()}
            placeholder="Ask about today's news…"
            className="flex-1 outline-none rounded-lg px-3 py-2"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--text-1)', fontFamily:'var(--font-body)', fontSize:'13px' }}
          />
          <button onClick={send} disabled={loading||!input.trim()}
            className="btn-panic px-4 py-2 rounded-lg disabled:opacity-40"
            style={{ fontFamily:'var(--font-display)', fontSize:'14px', letterSpacing:'0.05em' }}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
