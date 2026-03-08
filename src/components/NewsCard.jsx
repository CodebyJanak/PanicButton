import React, { useState } from 'react';
import { timeAgo, isBreaking, safeImage } from '../utils/helpers';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import { useAppStore } from '../store/appStore';

export default function NewsCard({ article, index=0, accentColor='#FF0000', density='comfortable', onAISummary, onShare, onBiasCheck, onFakeCheck }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const { state, dispatch }     = useAppStore();

  const breaking     = isBreaking(article);
  const imgSrc       = (imgError||!article.urlToImage) ? PLACEHOLDER_IMAGE : safeImage(article.urlToImage);
  const hasRealImg   = article.urlToImage && !imgError && !article.urlToImage.includes('removed');
  const isRead       = state.readHistory.includes(article.url);
  const isBookmarked = state.bookmarks.some(b=>b.article.url===article.url);
  const delayClass   = ['d1','d2','d3','d4','d5','d6'][Math.min(index%6,5)];

  const handleOpen = e => {
    if (e.target.closest('button')||e.target.closest('a')) return;
    if (article.url && article.url!=='#') {
      dispatch({ type:'HISTORY_ADD', url:article.url });
      window.open(article.url,'_blank','noopener,noreferrer');
    }
  };
  const toggleBookmark = e => {
    e.stopPropagation();
    isBookmarked ? dispatch({ type:'BOOKMARK_REMOVE', url:article.url }) : dispatch({ type:'BOOKMARK_ADD', article });
  };

  if (density==='headline') {
    return (
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer card-enter ${delayClass}`}
        style={{ background:hovered?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.02)', border:'1px solid var(--border)', transition:'all 0.2s', opacity:isRead?0.55:1 }}
        onClick={handleOpen} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background:breaking?'var(--red)':accentColor }} />
        <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:500, color:isRead?'var(--text-3)':'var(--text-1)', lineHeight:1.4, flex:1 }}>{article.title}</p>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', flexShrink:0, marginTop:'3px' }}>{timeAgo(article.publishedAt)}</span>
      </div>
    );
  }

  const compact = density==='compact';

  return (
    <div className={`glass-card rounded-2xl overflow-hidden flex flex-col cursor-pointer relative card-enter ${delayClass}`}
      style={{ transition:'transform 0.28s ease,box-shadow 0.28s ease,border-color 0.28s ease',
        transform:hovered?'translateY(-5px) scale(1.01)':'translateY(0) scale(1)',
        boxShadow:hovered?`0 20px 50px rgba(0,0,0,0.6),0 0 0 1px ${accentColor}22`:'none',
        borderColor:hovered?`${accentColor}33`:breaking?'rgba(255,0,0,0.18)':'var(--border)',
        opacity:isRead?0.65:1 }}
      onClick={handleOpen} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

      {!compact && (
        <div className="relative overflow-hidden flex-shrink-0" style={{ height:'168px' }}>
          {hasRealImg
            ? <img src={imgSrc} alt={article.title} onError={()=>setImgError(true)} loading="lazy" className="w-full h-full object-cover"
                style={{ transition:'transform 0.45s ease', transform:hovered?'scale(1.07)':'scale(1)' }} />
            : <div className="w-full h-full flex items-center justify-center relative" style={{ background:'linear-gradient(135deg,#07070f,#0c0c18)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.4) 10px,rgba(255,255,255,0.4) 20px)' }} />
                <span style={{ fontFamily:'var(--font-display)', fontSize:'36px', color:`${accentColor}20`, letterSpacing:'0.1em', zIndex:1 }}>⚡</span>
              </div>
          }
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background:'linear-gradient(to top,#0c0c18,transparent)' }} />
          {breaking && (
            <div className="absolute top-2.5 left-2.5">
              <span className="badge-pulse px-2.5 py-1 rounded-md" style={{ fontFamily:'var(--font-mono)', fontSize:'8px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'var(--red)', color:'white' }}>● BREAKING</span>
            </div>
          )}
          {isRead && <div className="absolute top-2.5 right-2.5"><span className="px-2 py-0.5 rounded-sm" style={{ fontFamily:'var(--font-mono)', fontSize:'7px', letterSpacing:'0.1em', background:'rgba(0,0,0,0.7)', color:'var(--text-3)', textTransform:'uppercase' }}>READ</span></div>}
        </div>
      )}

      <div className="flex flex-col gap-2 p-4 flex-1 relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded-md truncate" style={{ maxWidth:'120px', fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.1em', textTransform:'uppercase', color:accentColor, background:`${accentColor}12`, border:`1px solid ${accentColor}20` }}>
            {(article.source?.name||'News').substring(0,18)}
          </span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', flexShrink:0 }}>{timeAgo(article.publishedAt)}</span>
        </div>

        <h3 className="flex-1" style={{ fontFamily:'var(--font-body)', fontSize:compact?'12.5px':'13.5px', fontWeight:600, lineHeight:1.45, color:isRead?'var(--text-2)':'var(--text-1)', display:'-webkit-box', WebkitLineClamp:compact?2:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {article.title||'No title'}
        </h3>

        {!compact && article.description && (
          <p style={{ fontFamily:'var(--font-body)', fontSize:'11.5px', color:'var(--text-2)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{article.description}</p>
        )}

        <div className="flex items-center justify-between pt-2" style={{ borderTop:'1px solid rgba(255,255,255,0.05)', marginTop:'auto' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100px' }}>
            {(article.author?.split(',')[0]||article.source?.name||'Unknown').substring(0,18)}
          </span>
          <div className="flex items-center gap-0.5">
            {onAISummary && <ActionBtn onClick={e=>{e.stopPropagation();onAISummary(article)}} title="AI Summary" color="#9d4edd">🤖</ActionBtn>}
            {onBiasCheck && <ActionBtn onClick={e=>{e.stopPropagation();onBiasCheck(article)}} title="Bias Check" color="#3b82f6">⚖️</ActionBtn>}
            {onFakeCheck && <ActionBtn onClick={e=>{e.stopPropagation();onFakeCheck(article)}} title="Fact Check" color="#00ff88">🔍</ActionBtn>}
            {onShare && <ActionBtn onClick={e=>{e.stopPropagation();onShare(article)}} title="Share Card" color="var(--cyan)">🎨</ActionBtn>}
            <ActionBtn onClick={toggleBookmark} title={isBookmarked?'Remove':'Save'} color="#fbbf24">
              <span style={{ color:isBookmarked?'#fbbf24':'var(--text-3)' }}>{isBookmarked?'★':'☆'}</span>
            </ActionBtn>
            {article.url && article.url!=='#' && (
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                onClick={e=>{e.stopPropagation();dispatch({type:'HISTORY_ADD',url:article.url})}}
                style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.07em', textTransform:'uppercase', color:accentColor, textDecoration:'none', padding:'3px 8px', borderRadius:'4px', border:`1px solid ${accentColor}30`, background:hovered?`${accentColor}10`:'transparent', transition:'all 0.15s' }}>→</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, title, color, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title}
      className="transition-all duration-150 rounded-lg p-1.5 cursor-pointer"
      style={{ color, background:hov?`${color}15`:'transparent', border:'none', fontSize:'12px' }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </button>
  );
}
