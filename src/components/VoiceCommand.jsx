import React, { useState, useEffect, useRef } from 'react';

const COMMANDS = {
  'general':       () => ({ action:'category', value:'general' }),
  'top stories':   () => ({ action:'category', value:'general' }),
  'business':      () => ({ action:'category', value:'business' }),
  'technology':    () => ({ action:'category', value:'technology' }),
  'tech':          () => ({ action:'category', value:'technology' }),
  'sports':        () => ({ action:'category', value:'sports' }),
  'health':        () => ({ action:'category', value:'health' }),
  'science':       () => ({ action:'category', value:'science' }),
  'entertainment': () => ({ action:'category', value:'entertainment' }),
  'crypto':        () => ({ action:'category', value:'crypto' }),
  'search':        (t) => ({ action:'search', value:t.replace(/^search\s*/i,'').trim() }),
  'find':          (t) => ({ action:'search', value:t.replace(/^find\s*/i,'').trim() }),
  'panic':         () => ({ action:'panic' }),
  'briefing':      () => ({ action:'briefing' }),
  'bookmarks':     () => ({ action:'bookmarks' }),
};

export default function VoiceCommand({ onCommand }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recRef = useRef(null);

  const start = () => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = true;
    rec.onstart = () => setListening(true);
    rec.onresult = e => {
      const t = Array.from(e.results).map(r=>r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length-1].isFinal) {
        processCommand(t.toLowerCase().trim());
      }
    };
    rec.onend = () => { setListening(false); setTimeout(()=>setTranscript(''), 2000); };
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
  };

  const stop = () => { recRef.current?.stop(); setListening(false); };

  const processCommand = (text) => {
    for (const [cmd, handler] of Object.entries(COMMANDS)) {
      if (text.startsWith(cmd) || text.includes(cmd)) {
        const result = handler(text);
        if (result) { onCommand(result); return; }
      }
    }
    // Default: search
    if (text.length > 2) onCommand({ action:'search', value:text });
  };

  if (!supported) return null;

  return (
    <div className="relative">
      <button
        onMouseDown={start} onMouseUp={stop} onTouchStart={start} onTouchEnd={stop}
        className="flex items-center gap-2 cursor-pointer transition-all duration-200"
        style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.07em', textTransform:'uppercase',
          color: listening ? 'var(--red)' : 'var(--text-3)',
          background: listening ? 'rgba(255,0,0,0.08)' : 'rgba(255,255,255,0.03)',
          border:`1px solid ${listening?'rgba(255,0,0,0.3)':'var(--border)'}`,
          padding:'7px 12px', borderRadius:'6px' }}>
        {listening ? <div className="live-pulse" style={{ width:'7px', height:'7px' }} /> : '🎤'}
        <span className="hidden md:inline">{listening ? 'Listening…' : 'Voice'}</span>
      </button>
      {transcript && (
        <div className="absolute top-full mt-2 right-0 px-3 py-2 rounded-lg whitespace-nowrap z-50"
          style={{ background:'var(--surface-2)', border:'1px solid var(--border)', fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-1)' }}>
          "{transcript}"
        </div>
      )}
    </div>
  );
}
