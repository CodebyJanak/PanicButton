import React, { useRef, useEffect, useState } from 'react';
import { timeAgo } from '../utils/helpers';

export default function ShareCardModal({ article, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!article || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = 800, H = 420;
    canvas.width = W; canvas.height = H;

    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // Red accent bar
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, W, 4);

    // Grid pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Source badge
    ctx.fillStyle = 'rgba(255,0,0,0.12)';
    ctx.roundRect(40, 40, 120, 26, 4);
    ctx.fill();
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 11px monospace';
    ctx.fillText((article.source?.name || 'NEWS').toUpperCase().substring(0, 14), 52, 58);

    // Time
    ctx.fillStyle = '#555570';
    ctx.font = '11px monospace';
    ctx.fillText(timeAgo(article.publishedAt).toUpperCase(), W - 160, 58);

    // Title
    ctx.fillStyle = '#f0f0f5';
    const title = article.title || '';
    const words = title.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line + (line ? ' ' : '') + w;
      ctx.font = 'bold 28px sans-serif';
      if (ctx.measureText(test).width > W - 80 && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    ctx.font = 'bold 28px sans-serif';
    lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, 40, 120 + i * 38));

    // Description
    if (article.description) {
      ctx.fillStyle = '#8888aa';
      ctx.font = '14px sans-serif';
      const desc = article.description.substring(0, 110);
      ctx.fillText(desc, 40, 120 + Math.min(lines.length, 4) * 38 + 24);
    }

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, H - 52, W, 52);
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('🚨 PANIC BUTTON', 40, H - 22);
    ctx.fillStyle = '#555570';
    ctx.font = '11px monospace';
    ctx.fillText('Live Intelligence Feed · panic-button.app', 40, H - 8);

    // Red glow effect
    const grad = ctx.createRadialGradient(W, 0, 0, W, 0, 300);
    grad.addColorStop(0, 'rgba(255,0,0,0.06)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }, [article]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'panic-button-news.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    try {
      canvasRef.current.toBlob(async blob => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    } catch { handleDownload(); }
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background:'rgba(5,5,5,0.9)', backdropFilter:'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full rounded-2xl overflow-hidden" style={{ maxWidth:'660px', background:'#0a0a0f', border:'1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'18px', letterSpacing:'0.1em', color:'#f0f0f5' }}>🎨 SHARE CARD</span>
          <button onClick={onClose} style={{ color:'#555570', background:'none', border:'none', cursor:'pointer', fontSize:'20px' }}>×</button>
        </div>
        <div className="p-5">
          <canvas ref={canvasRef} className="w-full rounded-lg" style={{ border:'1px solid rgba(255,255,255,0.06)' }} />
          <div className="flex gap-3 mt-4">
            <button onClick={handleDownload}
              className="flex-1 py-2.5 rounded-md cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{ fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase',
                background:'rgba(255,255,255,0.05)', color:'#f0f0f5', border:'1px solid rgba(255,255,255,0.1)' }}>
              ⬇ Download PNG
            </button>
            <button onClick={handleCopy}
              className="flex-1 py-2.5 rounded-md cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{ fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.08em', textTransform:'uppercase',
                background: copied ? 'rgba(52,211,153,0.1)' : '#FF0000', color:'white', border:'none',
                boxShadow: copied ? 'none' : '0 0 16px rgba(255,0,0,0.3)' }}>
              {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
