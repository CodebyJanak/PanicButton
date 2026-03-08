import React from "react";

export default function PanicModeBar({ onDeactivate, count }) {
  return (
    <div
      className="panic-bar-animate flex items-center justify-between px-6 py-2"
    >
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "13px",
          letterSpacing: "0.18em",
          color: "white",
          textShadow: "0 0 10px rgba(255,255,255,0.4)",
        }}
      >
        ⚠ PANIC MODE ACTIVE — EMERGENCY &amp; BREAKING NEWS ONLY
        {count !== undefined && ` — ${count} ALERTS`} ⚠
      </span>
      <button
        onClick={onDeactivate}
        className="cursor-pointer transition-all duration-200 hover:opacity-80"
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.35)",
          color: "white",
          padding: "4px 14px",
          borderRadius: "4px",
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Deactivate
      </button>
    </div>
  );
}
