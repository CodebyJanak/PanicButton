import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { timeAgo } from '../utils/helpers';

export default function BookmarksPanel({ isOpen, onClose }) {
  const { state, dispatch } = useAppStore();
  const [filter, setFilter] = useState('');

  const filtered = state.bookmarks.filter(b =>
    !filter || b.article.title?.toLowerCase().includes(filter.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end pt-16"
      style={{ background:'rgba(5,5,5,0.6)', backdropFilter:'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="h-full flex flex-col" style={{ width:'380px', background:'#0a0a0f', borderLeft:'1px solid rgba(255,255,255,0.07)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'18px', letterSpacing:'0.1em', color:'#f0f0f5' }}>📑 SAVED</span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px',
              background:'rgba(255,0,0,0.1)', color:'#FF0000', border:'1px solid rgba(255,0,0,0.2)' }}>
              {state.bookmarks.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {state.bookmarks.length > 0 && (
              <button onClick={() => { if(window.confirm('Clear all saved articles?')) dispatch({ type:'BOOKMARK_CLEAR' }); }}
                style={{ fontFamily:"'Space Mono', monospace", fontSize:'8px', color:'#555570', background:'none', border:'none', cursor:'pointer', letterSpacing:'0.06em' }}>
                CLEAR ALL
              </button>
            )}
            <button onClick={onClose} style={{ color:'#555570', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
          </div>
        </div>

        {/* Search */}
        {state.bookmarks.length > 3 && (
          <div className="px-4 py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter saved articles…"
              className="w-full outline-none rounded-md px-3 py-2"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                color:'#f0f0f5', fontFamily:"'DM Sans', sans-serif", fontSize:'12px' }} />
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div style={{ fontSize:'36px', opacity:0.2 }}>📑</div>
              <p style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'18px', letterSpacing:'0.08em', color:'#8888aa' }}>
                {state.bookmarks.length === 0 ? 'No Saved Articles' : 'No matches'}
              </p>
              <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'9px', color:'#555570', textAlign:'center', lineHeight:1.7 }}>
                {state.bookmarks.length === 0 ? 'Click the bookmark icon on any article to save it' : 'Try a different filter'}
              </p>
            </div>
          ) : (
            filtered.map(({ article, savedAt }, i) => (
              <div key={i} className="rounded-lg overflow-hidden group"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,0,0,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'}>
                {article.urlToImage && (
                  <img src={article.urlToImage} alt="" className="w-full object-cover" style={{ height:'100px' }}
                    onError={e => e.target.style.display='none'} />
                )}
                <div className="p-3">
                  <p className="mb-1 cursor-pointer hover:underline" onClick={() => window.open(article.url,'_blank')}
                    style={{ fontFamily:"'DM Sans', sans-serif", fontSize:'12px', fontWeight:600, color:'#f0f0f5', lineHeight:1.4,
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {article.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'8px', color:'#555570', letterSpacing:'0.04em' }}>
                      {article.source?.name} · Saved {timeAgo(savedAt)}
                    </span>
                    <button onClick={() => dispatch({ type:'BOOKMARK_REMOVE', url:article.url })}
                      style={{ color:'#555570', background:'none', border:'none', cursor:'pointer', fontSize:'14px', lineHeight:1 }}
                      onMouseEnter={e => e.target.style.color='#FF0000'} onMouseLeave={e => e.target.style.color='#555570'}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
