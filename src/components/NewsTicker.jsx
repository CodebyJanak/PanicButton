import React from "react";

export default function NewsTicker({ articles }) {
  if (!articles || articles.length === 0) return null;
  const items = [...articles, ...articles];
  return (
    <div className="relative overflow-hidden rounded-md mb-10"
      style={{ background: "rgba(255,0,0,0.04)", border: "1px solid rgba(255,0,0,0.09)", padding: "8px 0" }}>
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-4 z-10"
        style={{ background: "#FF0000", clipPath: "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)", minWidth: "110px" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "13px", letterSpacing: "0.12em", color: "white" }}>LIVE FEED</span>
      </div>
      <div className="overflow-hidden" style={{ paddingLeft: "120px" }}>
        <div className="ticker-track">
          {items.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-3 whitespace-nowrap" style={{ padding: "0 24px" }}>
              <span style={{ color: "#FF0000", fontSize: "7px" }}>◆</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.05em", color: "#8888aa" }}>
                {(a.title || "").substring(0, 90)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
