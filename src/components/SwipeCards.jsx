import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { timeAgo } from '../utils/helpers';

export default function SwipeCards({ articles, isOpen, onClose }) {
  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x:0, y:0 });
  const [exiting, setExiting] = useState(null);
  const startPos = useRef(null);
  const { dispatch } = useAppStore();

  if (!isOpen) return null;
  const remaining = articles.slice(idx);
  if (remaining.length === 0) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background:'rgba(3,3,8,0.95)' }}>
        <div className="text-center">
          <p style={{ fontSize:'48px', marginBottom:'16px' }}>🎉</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'32px', letterSpacing:'0.1em', color:'var(--text-1)' }}>ALL CAUGHT UP</p>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-3)', marginTop:'8px' }}>You've gone through all today's news</p>
          <button onClick={onClose} className="btn-panic mt-6 px-6 py-2.5 rounded-lg"
            style={{ fontFamily:'var(--font-display)', fontSize:'16px', letterSpacing:'0.08em' }}>DONE</button>
        </div>
      </div>
    );
  }

  const article = remaining[0];
  const nextArticle = remaining[1];

  const onDragStart = (e) => {
    const pos = e.touches ? { x:e.touches[0].clientX, y:e.touches[0].clientY } : { x:e.clientX, y:e.clientY };
    startPos.current = pos;
    setDragging(true);
  };

  const onDragMove = (e) => {
    if (!dragging || !startPos.current) return;
    const pos = e.touches ? { x:e.touches[0].clientX, y:e.touches[0].clientY } : { x:e.clientX, y:e.clientY };
    setOffset({ x:pos.x-startPos.current.x, y:pos.y-startPos.current.y });
  };

  const onDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (offset.x > 80) {
      // Swipe right = bookmark
      dispatch({ type:'BOOKMARK_ADD', article });
      dismiss('right');
    } else if (offset.x < -80) {
      dismiss('left');
    } else {
      setOffset({ x:0, y:0 });
    }
    startPos.current = null;
  };

  const dismiss = (dir) => {
    setExiting(dir);
    setTimeout(() => { setIdx(i=>i+1); setOffset({x:0,y:0}); setExiting(null); }, 300);
  };

  const rotation = (offset.x / window.innerWidth) * 20;
  const opacity  = Math.max(0, 1 - Math.abs(offset.x) / 300);
  const likeOpacity  = Math.max(0, offset.x / 80);
  const dislikeOpacity = Math.max(0, -offset.x / 80);

  const cardStyle = {
    transform: exiting === 'right'
      ? 'translateX(120%) rotate(20deg)'
      : exiting === 'left'
      ? 'translateX(-120%) rotate(-20deg)'
      : `translateX(${offset.x}px) translateY(${offset.y*0.3}px) rotate(${rotation}deg)`,
    transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
    opacity: exiting ? 0 : 1,
  };

  return (
    <div className="fixed inset-0 z-[400] flex flex-col items-center justify-center p-6"
      style={{ background:'rgba(3,3,8,0.97)' }}>
      <div className="flex items-center justify-between w-full mb-6" style={{ maxWidth:'400px' }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.1em', color:'var(--text-2)' }}>SWIPE MODE</p>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-3)' }}>{idx}/{articles.length}</span>
          <button onClick={onClose} style={{ color:'var(--text-3)', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
      </div>

      <div className="relative w-full" style={{ maxWidth:'380px', height:'500px' }}>
        {/* Next card (behind) */}
        {nextArticle && (
          <div className="absolute inset-0 rounded-2xl glass-card" style={{ transform:'scale(0.95) translateY(16px)', zIndex:0 }}>
            {nextArticle.urlToImage && <img src={nextArticle.urlToImage} alt="" className="w-full h-full object-cover rounded-2xl" />}
            <div className="absolute inset-0 rounded-2xl" style={{ background:'linear-gradient(to top,rgba(3,3,8,0.95),rgba(3,3,8,0.3))' }} />
          </div>
        )}

        {/* Current card */}
        <div className="absolute inset-0 rounded-2xl glass-card overflow-hidden z-10 cursor-grab"
          style={cardStyle}
          onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd}
          onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}>
          {article.urlToImage && <img src={article.urlToImage} alt="" className="w-full h-full object-cover" draggable={false} />}
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(3,3,8,0.97),rgba(3,3,8,0.1) 50%)' }} />

          {/* Like/Dislike indicators */}
          <div className="absolute top-6 left-6 px-4 py-2 rounded-lg" style={{ opacity:likeOpacity, background:'rgba(0,255,136,0.2)', border:'2px solid var(--green)', transform:`rotate(-${Math.abs(rotation)*0.5}deg)` }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'20px', color:'var(--green)', letterSpacing:'0.1em' }}>★ SAVE</span>
          </div>
          <div className="absolute top-6 right-6 px-4 py-2 rounded-lg" style={{ opacity:dislikeOpacity, background:'rgba(255,0,0,0.15)', border:'2px solid var(--red)', transform:`rotate(${Math.abs(rotation)*0.5}deg)` }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'20px', color:'var(--red)', letterSpacing:'0.1em' }}>✕ SKIP</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', marginBottom:'8px' }}>
              {article.source?.name} · {timeAgo(article.publishedAt)}
            </p>
            <h2 className="clamp-3" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(18px,4vw,24px)', letterSpacing:'0.03em', color:'white', lineHeight:1.15, marginBottom:'12px' }}>
              {article.title}
            </h2>
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              onClick={e=>e.stopPropagation()}
              style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--cyan)', textDecoration:'none', letterSpacing:'0.08em' }}>
              Read full story →
            </a>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6 mt-6">
        <button onClick={() => dismiss('left')} className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          style={{ background:'rgba(255,0,0,0.1)', border:'2px solid rgba(255,0,0,0.3)', fontSize:'22px' }}>✕</button>
        <button onClick={() => window.open(article.url,'_blank')} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', fontSize:'16px' }}>↗</button>
        <button onClick={() => { dispatch({ type:'BOOKMARK_ADD', article }); dismiss('right'); }}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          style={{ background:'rgba(0,255,136,0.1)', border:'2px solid rgba(0,255,136,0.3)', fontSize:'22px' }}>★</button>
      </div>

      <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--text-3)', marginTop:'12px', letterSpacing:'0.08em' }}>
        SWIPE RIGHT TO SAVE · SWIPE LEFT TO SKIP
      </p>
    </div>
  );
}
