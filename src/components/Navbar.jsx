import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import ReadingStreak from './ReadingStreak';
import VoiceCommand from './VoiceCommand';

export default function Navbar({
  panicMode, onPanicToggle, onSearchOpen, onBookmarks, onSettings,
  online, onChat, onBriefing, onAlerts, onSwipe, onVoiceCommand,
}) {
  const [shake, setShake] = useState(false);
  const { state } = useAppStore();

  const handlePanic = () => {
    setShake(true);
    setTimeout(() => setShake(false), 420);
    onPanicToggle();
  };

  const alertCount = state.keywordAlerts.length;
  const bookmarkCount = state.bookmarks.length;

  return (
    <nav className="sticky top-0 z-50"
      style={{ background:'rgba(3,3,8,0.92)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', borderBottom:'1px solid var(--border)' }}>
      {/* Top row */}
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 no-underline" style={{ textDecoration:'none' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg glow-red flex-shrink-0"
            style={{ background:'var(--red)' }}>🚨</div>
          <div className="hidden sm:block">
            <p style={{ fontFamily:'var(--font-display)', fontSize:'24px', letterSpacing:'0.12em', lineHeight:1, color:'var(--text-1)' }}>
              <span className="text-glow-red" style={{ color:'var(--red)' }}>PANIC</span>
              <span style={{ color:'rgba(255,255,255,0.4)', margin:'0 6px' }}>·</span>
              <span>BUTTON</span>
            </p>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'7px', letterSpacing:'0.18em', color:'var(--text-3)', marginTop:'1px' }}>LIVE INTELLIGENCE FEED</p>
          </div>
          {!online && (
            <span className="px-2 py-0.5 rounded-sm" style={{ fontFamily:'var(--font-mono)', fontSize:'7px', letterSpacing:'0.1em', background:'rgba(255,179,71,0.1)', color:'var(--amber)', border:'1px solid rgba(255,179,71,0.2)', textTransform:'uppercase' }}>OFFLINE</span>
          )}
        </a>

        <div className="flex items-center gap-1.5">
          {/* Streak */}
          <div className="hidden lg:block"><ReadingStreak /></div>

          {/* AI Chat */}
          <button onClick={onChat}
            className="btn-ghost flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'9px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            <span>🤖</span><span className="hidden md:inline">Ask AI</span>
          </button>

          {/* Daily Briefing */}
          <button onClick={onBriefing}
            className="btn-ghost flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'9px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            <span>📰</span><span className="hidden lg:inline">Briefing</span>
          </button>

          {/* Swipe mode */}
          <button onClick={onSwipe}
            className="btn-ghost flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'9px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            <span>🃏</span><span className="hidden xl:inline">Swipe</span>
          </button>

          {/* Voice */}
          <VoiceCommand onCommand={onVoiceCommand} />

          {/* Search */}
          <button onClick={onSearchOpen}
            className="btn-ghost flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'9px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            <span>🔍</span>
            <span className="hidden md:inline">Search</span>
            <span className="hidden lg:inline" style={{ color:'var(--text-3)', fontSize:'8px' }}>⌘K</span>
          </button>

          {/* Alerts */}
          <button onClick={onAlerts}
            className="btn-ghost relative flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'9px', letterSpacing:'0.06em', textTransform:'uppercase', borderColor: alertCount>0 ? 'rgba(255,0,0,0.3)' : undefined }}>
            <span>🔔</span>
            {alertCount > 0 && (
              <span className="flex items-center justify-center rounded-full badge-pulse"
                style={{ minWidth:'14px', height:'14px', background:'var(--red)', color:'white', fontSize:'7px', fontWeight:700, padding:'0 3px' }}>
                {alertCount}
              </span>
            )}
          </button>

          {/* Bookmarks */}
          <button onClick={onBookmarks}
            className="btn-ghost relative flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'9px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            <span>📑</span>
            {bookmarkCount > 0 && (
              <span className="flex items-center justify-center rounded-full"
                style={{ minWidth:'14px', height:'14px', background:'#fbbf24', color:'#050505', fontSize:'7px', fontWeight:700, padding:'0 3px' }}>
                {bookmarkCount > 99 ? '99+' : bookmarkCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button onClick={onSettings}
            className="btn-ghost px-3 py-2 rounded-lg cursor-pointer"
            style={{ fontSize:'14px' }}>⚙</button>

          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.1em', color:'var(--red)', textTransform:'uppercase', background:'var(--red-dim)', border:'1px solid rgba(255,0,0,0.15)' }}>
            <div className="live-pulse" />LIVE
          </div>

          {/* PANIC button */}
          <button onClick={handlePanic}
            className={`btn-panic px-4 py-2 rounded-xl ${shake ? 'panic-shake' : ''}`}
            style={{ fontFamily:'var(--font-display)', fontSize:'15px', letterSpacing:'0.1em',
              boxShadow: panicMode ? '0 0 40px rgba(255,0,0,0.8)' : '0 0 20px rgba(255,0,0,0.35)' }}>
            {panicMode ? '🔴 PANIC ON' : '🚨 PANIC'}
          </button>
        </div>
      </div>
    </nav>
  );
}
