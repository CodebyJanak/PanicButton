import React, { useState } from 'react';
import { timeAgo, safeImage } from '../utils/helpers';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import { useAppStore } from '../store/appStore';

export default function HeroCard({ article, accentColor = '#FF0000', onAISummary, onShare }) {
  const [imgError, setImgError] = useState(false);
  const { state, dispatch } = useAppStore();
  if (!article) return null;

  const imgSrc     = (imgError || !article.urlToImage) ? PLACEHOLDER_IMAGE : safeImage(article.urlToImage);
  const hasRealImg = article.urlToImage && !imgError && !article.urlToImage.includes('removed');
  const isBookmarked = state.bookmarks.some(b => b.article.url === article.url);

  const toggleBookmark = e => { e.stopPropagation(); isBookmarked ? dispatch({ type:'BOOKMARK_REMOVE', url:article.url }) : dispatch({ type:'BOOKMARK_ADD', article }); };

  return (
    <div className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ height:'460px', border:`1px solid rgba(255,255,255,0.06)`, transition:'transform 0.4s ease, box-shadow 0.4s ease' }}
      onClick={() => { if (article.url) { dispatch({ type:'HISTORY_ADD', url:article.url }); window.open(article.url, '_blank', 'noopener,noreferrer'); } }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
      {hasRealImg ? (
        <img src={imgSrc} alt={article.title} onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition:'transform 0.6s ease' }}
          ref={el => { if (el) { const p = el.parentElement; p.addEventListener('mouseenter', () => el.style.transform='scale(1.04)'); p.addEventListener('mouseleave', () => el.style.transform='scale(1)'); }}} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background:'linear-gradient(135deg, #0a0a1a 0%, #0f0f20 50%, #080810 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage:`linear-gradient(${accentColor}55 1px, transparent 1px), linear-gradient(90deg, ${accentColor}55 1px, transparent 1px)`, backgroundSize:'40px 40px' }} />
          <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'72px', color:`${accentColor}10`, letterSpacing:'0.1em', zIndex:1 }}>PANIC</span>
        </div>
      )}
      <div className="absolute inset-0 transition-all duration-300" style={{ background:'linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.6) 50%, rgba(5,5,5,0.15) 100%)' }} />

      {/* Action buttons top-right */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {onAISummary && (
          <button onClick={e => { e.stopPropagation(); onAISummary(article); }}
            className="px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer"
            style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase',
              background:'rgba(167,139,250,0.15)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.3)',
              backdropFilter:'blur(8px)' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(167,139,250,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(167,139,250,0.15)'}>
            🤖 AI Summary
          </button>
        )}
        {onShare && (
          <button onClick={e => { e.stopPropagation(); onShare(article); }}
            className="px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer"
            style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase',
              background:'rgba(0,212,255,0.1)', color:'#00d4ff', border:'1px solid rgba(0,212,255,0.25)',
              backdropFilter:'blur(8px)' }}>
            🎨
          </button>
        )}
        <button onClick={toggleBookmark}
          className="px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer"
          style={{ fontFamily:"'Space Mono', monospace", fontSize:'14px',
            background: isBookmarked ? 'rgba(251,191,36,0.15)' : 'rgba(0,0,0,0.3)',
            color: isBookmarked ? '#fbbf24' : '#8888aa', border:'1px solid rgba(255,255,255,0.1)',
            backdropFilter:'blur(8px)' }}>
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge-pulse rounded-sm px-3 py-1 text-white"
            style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', background:accentColor }}>● Breaking News</span>
          {article.source?.name && (
            <span className="rounded-sm px-3 py-1" style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.08em', textTransform:'uppercase', background:'rgba(255,255,255,0.07)', color:'#8888aa', border:'1px solid rgba(255,255,255,0.06)' }}>{article.source.name}</span>
          )}
        </div>
        <h1 className="mb-3 leading-tight" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(22px, 3vw, 44px)', letterSpacing:'0.03em', color:'#f0f0f5', textShadow:'0 2px 20px rgba(0,0,0,0.6)' }}>
          {article.title}
        </h1>
        <div className="flex items-center gap-4 mb-5" style={{ fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.07em', color:'#555570', textTransform:'uppercase' }}>
          <span>{timeAgo(article.publishedAt)}</span>
          {article.author && (<><span style={{ width:'3px', height:'3px', background:'#555570', borderRadius:'50%', display:'inline-block' }} /><span>{article.author.split(',')[0].substring(0,30)}</span></>)}
        </div>
        {article.url && (
          <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={e => { e.stopPropagation(); dispatch({ type:'HISTORY_ADD', url:article.url }); }}
            className="hero-read-btn inline-flex items-center gap-3 px-7 py-3 rounded-md no-underline"
            style={{ fontFamily:"'Space Mono', monospace", fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'white', background:'transparent', position:'relative', zIndex:1, borderColor:`${accentColor}80` }}>
            Read Full Story <span style={{ fontSize:'14px' }}>→</span>
          </a>
        )}
      </div>
    </div>
  );
}
