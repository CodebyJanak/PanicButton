import React from 'react';
import NewsCard from './NewsCard';
import { SkeletonCard } from './SkeletonCard';
import { SUPPORTED_COUNTRIES } from '../utils/constants';
import { isBreaking } from '../utils/helpers';

export default function LocalNewsSection({
  articles, loading, error, countryCode, countryName,
  locationStatus, onRetry, panicMode, density,
  onAISummary, onShare, onBiasCheck, onFakeCheck
}) {
  const unsupported = countryCode && !SUPPORTED_COUNTRIES.has(countryCode);
  const display = panicMode ? articles.filter(isBreaking) : articles;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ height:'36px', background:'var(--cyan)', boxShadow:'0 0 12px rgba(0,245,255,0.4)' }} />
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:'2px' }}>Regional Coverage</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(24px,3.5vw,36px)', letterSpacing:'0.05em', lineHeight:1, display:'flex', alignItems:'center', gap:'8px' }}>
              <span>📍</span>
              <span className="text-gradient">News Near You</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {locationStatus === 'detecting' ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--amber)', background:'rgba(255,179,71,0.06)', border:'1px solid rgba(255,179,71,0.15)' }}>
              <div className="live-pulse" style={{ width:'6px', height:'6px', background:'var(--amber)' }} /> Detecting…
            </div>
          ) : countryName ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--cyan)', background:'rgba(0,245,255,0.06)', border:'1px solid rgba(0,245,255,0.14)' }}>
              📍 {countryName}
            </div>
          ) : null}
          {onRetry && (
            <button onClick={onRetry} disabled={loading || locationStatus==='detecting'}
              className="cursor-pointer hover:opacity-75 disabled:opacity-40"
              style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-2)', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'6px 12px', borderRadius:'6px' }}>
              ↻
            </button>
          )}
        </div>
      </div>

      {unsupported ? (
        <div className="flex flex-col items-center py-10 gap-3 rounded-2xl" style={{ background:'rgba(255,179,71,0.03)', border:'1px solid rgba(255,179,71,0.1)' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'20px', letterSpacing:'0.08em', color:'var(--amber)' }}>Region Not Supported</p>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)' }}>NewsAPI free tier doesn't cover {countryName || countryCode?.toUpperCase()}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-10 gap-3 rounded-2xl" style={{ background:'rgba(255,0,0,0.03)', border:'1px solid rgba(255,0,0,0.08)' }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--red)', textAlign:'center', maxWidth:'340px', lineHeight:1.7 }}>{error}</p>
          {onRetry && <button onClick={onRetry} className="cursor-pointer hover:opacity-80"
            style={{ fontFamily:'var(--font-mono)', fontSize:'9px', textTransform:'uppercase', color:'var(--red)', background:'rgba(255,0,0,0.08)', border:'1px solid rgba(255,0,0,0.25)', padding:'8px 20px', borderRadius:'6px' }}>Retry →</button>}
        </div>
      ) : loading ? (
        <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))' }}>
          {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
        </div>
      ) : display.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'20px', letterSpacing:'0.08em', color:'var(--text-2)' }}>
            {panicMode ? 'No Breaking Alerts' : 'No Local Stories'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))' }}>
          {display.map((article, i) => (
            <NewsCard key={`${article.url}-${i}`} article={article} index={i}
              accentColor="var(--cyan)" density={density}
              onAISummary={onAISummary} onShare={onShare}
              onBiasCheck={onBiasCheck} onFakeCheck={onFakeCheck} />
          ))}
        </div>
      )}
    </section>
  );
}
