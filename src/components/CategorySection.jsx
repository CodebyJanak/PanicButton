import React from 'react';
import NewsCard from './NewsCard';
import { SkeletonCard, SkeletonHero } from './SkeletonCard';
import HeroCard from './HeroCard';
import { isBreaking } from '../utils/helpers';

export default function CategorySection({ category, articles, loading, error, panicMode, onRetry, density, onAISummary, onShare, onBiasCheck, onFakeCheck }) {
  const displayArticles = panicMode ? articles.filter(isBreaking) : articles;
  const heroArticle     = displayArticles.find(a=>a.urlToImage)||displayArticles[0];
  const gridArticles    = displayArticles.filter(a=>a!==heroArticle);

  const isNewspaper = density === 'newspaper';

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ height:'36px', background:category.accent, boxShadow:`0 0 16px ${category.accent}` }} />
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:'2px' }}>{category.description}</div>
            <h2 className="flex items-center gap-2" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3.5vw,36px)', letterSpacing:'0.05em', lineHeight:1 }}>
              <span>{category.icon}</span>
              <span className="text-gradient">{category.label}</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!loading && displayArticles.length>0 && (
            <span className="px-3 py-1 rounded-full" style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-3)', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)' }}>{displayArticles.length}</span>
          )}
          {onRetry && (
            <button onClick={onRetry} disabled={loading} className="cursor-pointer transition-all hover:opacity-75 disabled:opacity-40"
              style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-2)', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', padding:'6px 12px', borderRadius:'6px' }}>
              {loading?'…':'↻'}
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center py-10 gap-3 rounded-2xl" style={{ background:'rgba(255,0,0,0.03)', border:'1px solid rgba(255,0,0,0.08)' }}>
          <div style={{ fontSize:'28px', opacity:0.5 }}>⚠️</div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--red)', letterSpacing:'0.05em', textAlign:'center', maxWidth:'340px', lineHeight:1.7 }}>{error}</p>
          {onRetry && <button onClick={onRetry} className="cursor-pointer hover:opacity-80"
            style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--red)', background:'rgba(255,0,0,0.08)', border:'1px solid rgba(255,0,0,0.25)', padding:'8px 20px', borderRadius:'6px' }}>Retry →</button>}
        </div>
      ) : loading ? (
        <>
          <div className="mb-6"><SkeletonHero /></div>
          <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))' }}>
            {Array.from({length:6}).map((_,i)=><SkeletonCard key={i} />)}
          </div>
        </>
      ) : displayArticles.length===0 ? (
        <div className="flex flex-col items-center py-12 gap-3 rounded-2xl" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
          <div style={{ fontSize:'32px', opacity:0.2 }}>{panicMode?'✅':'📭'}</div>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'20px', letterSpacing:'0.08em', color:'var(--text-2)' }}>{panicMode?'No Breaking Alerts':'No Stories Found'}</p>
        </div>
      ) : isNewspaper ? (
        <div className="newspaper-mode">
          {displayArticles.map((article,i) => (
            <div key={`${article.url}-${i}`} className="newspaper-item">
              <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <p style={{ fontFamily:'var(--font-body)', fontWeight:700, fontSize:'13px', color:'var(--text-1)', lineHeight:1.4, marginBottom:'4px' }}>{article.title}</p>
                {article.description && <p className="clamp-2" style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'var(--text-2)', lineHeight:1.5 }}>{article.description}</p>}
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', marginTop:'6px' }}>{article.source?.name}</p>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <>
          {heroArticle && density!=='headline' && (
            <div className="mb-6">
              <HeroCard article={heroArticle} accentColor={category.accent} onAISummary={onAISummary} onShare={onShare} />
            </div>
          )}
          {density==='headline' ? (
            <div className="flex flex-col gap-1.5">
              {displayArticles.map((article,i) => (
                <NewsCard key={`${article.url}-${i}`} article={article} index={i} accentColor={category.accent} density="headline"
                  onAISummary={onAISummary} onShare={onShare} onBiasCheck={onBiasCheck} onFakeCheck={onFakeCheck} />
              ))}
            </div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))' }}>
              {gridArticles.map((article,i) => (
                <NewsCard key={`${article.url}-${i}`} article={article} index={i} accentColor={category.accent} density={density}
                  onAISummary={onAISummary} onShare={onShare} onBiasCheck={onBiasCheck} onFakeCheck={onFakeCheck} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
