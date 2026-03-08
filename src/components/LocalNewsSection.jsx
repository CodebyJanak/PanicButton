import React from 'react';
import NewsCard from './NewsCard';
import { SkeletonCard } from './SkeletonCard';
import { SUPPORTED_COUNTRIES } from '../utils/constants';
import { isBreaking } from '../utils/helpers';

export default function LocalNewsSection({ articles, loading, error, countryCode, countryName, locationStatus, onRetry, panicMode, density, onAISummary, onShare }) {
  const unsupported = countryCode && !SUPPORTED_COUNTRIES.has(countryCode);
  const display = panicMode ? articles.filter(isBreaking) : articles;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ height:'36px', background:'#00d4ff', boxShadow:'0 0 12px rgba(0,212,255,0.5)' }} />
          <div>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'#555570', marginBottom:'2px' }}>Regional Coverage</div>
            <h2 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(24px,3.5vw,36px)', letterSpacing:'0.05em', lineHeight:1, display:'flex', alignItems:'center', gap:'8px' }}>
              <span>📍</span>
              <span style={{ background:'linear-gradient(135deg, #f0f0f5 40%, #8888aa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>News Near You</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {locationStatus === 'detecting' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', color:'#ffb347', background:'rgba(255,179,71,0.06)', border:'1px solid rgba(255,179,71,0.15)' }}>
              <div className="live-dot w-1.5 h-1.5 rounded-full" style={{ background:'#ffb347' }} /> Detecting…
            </div>
          ) : countryName ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', color:'#00d4ff', background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.14)' }}>
              📍 {countryName}{countryCode ? ` [${countryCode.toUpperCase()}]` : ''}
              {unsupported && <span style={{ color:'#ffb347', fontSize:'8px' }}>↗ US fallback</span>}
              {locationStatus === 'denied' && <span style={{ color:'#555570', fontSize:'8px' }}>(IP)</span>}
            </div>
          ) : null}
          {onRetry && (
            <button onClick={onRetry} disabled={loading} className="cursor-pointer transition-all hover:opacity-75 disabled:opacity-40"
              style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase', color:'#8888aa', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', padding:'6px 12px', borderRadius:'6px' }}>
              {loading ? '…' : '↻'}
            </button>
          )}
        </div>
      </div>

      {locationStatus === 'denied' && !loading && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-5" style={{ background:'rgba(255,179,71,0.05)', border:'1px solid rgba(255,179,71,0.12)' }}>
          <span style={{ fontSize:'16px', flexShrink:0 }}>ℹ️</span>
          <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'10px', color:'rgba(255,179,71,0.8)', lineHeight:1.7, letterSpacing:'0.04em' }}>
            Location permission denied — showing news based on IP address.
            {unsupported && ' Your country is not supported by NewsAPI free tier, showing US news instead.'}
          </p>
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center py-10 gap-3 rounded-xl" style={{ background:'rgba(0,212,255,0.02)', border:'1px solid rgba(0,212,255,0.07)' }}>
          <div style={{ fontSize:'28px', opacity:0.4 }}>⚠️</div>
          <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'10px', color:'#00d4ff', letterSpacing:'0.05em', textAlign:'center', maxWidth:'360px', lineHeight:1.7 }}>{error}</p>
        </div>
      ) : loading ? (
        <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))' }}>
          {Array.from({ length:8 }).map((_,i) => <SkeletonCard key={i} />)}
        </div>
      ) : display.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3 rounded-xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize:'32px', opacity:0.2 }}>📭</div>
          <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'20px', letterSpacing:'0.08em', color:'#8888aa' }}>No Local Stories</p>
        </div>
      ) : density === 'headline' ? (
        <div className="flex flex-col gap-1.5">
          {display.map((article, i) => <NewsCard key={`${article.url}-${i}`} article={article} index={i} accentColor="#00d4ff" density="headline" onAISummary={onAISummary} onShare={onShare} />)}
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))' }}>
          {display.map((article, i) => <NewsCard key={`${article.url}-${i}`} article={article} index={i} accentColor="#00d4ff" density={density} onAISummary={onAISummary} onShare={onShare} />)}
        </div>
      )}
    </section>
  );
}
