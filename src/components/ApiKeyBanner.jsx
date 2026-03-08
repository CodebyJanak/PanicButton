import React, { useState } from "react";

export default function ApiKeyBanner({ onSave }) {
  const [input, setInput] = useState("");

  const handleSave = () => {
    if (!input.trim()) return;
    onSave(input.trim());
  };

  return (
    <div
      className="rounded-xl p-5 mb-7 flex gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(255,179,71,0.07), rgba(255,179,71,0.02))",
        border: "1px solid rgba(255,179,71,0.22)",
      }}
    >
      <div className="text-xl flex-shrink-0 mt-0.5">🔑</div>
      <div className="flex-1" style={{ color: "#ffb347" }}>
        <p
          className="font-semibold mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
        >
          NewsAPI Key Required
        </p>
        <p style={{ fontSize: "12px", lineHeight: "1.7", color: "rgba(255,179,71,0.75)" }}>
          Enter your free key from{" "}
          <a
            href="https://newsapi.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffb347", textDecoration: "underline" }}
          >
            newsapi.org
          </a>
          . The free tier works on{" "}
          <span style={{ fontFamily: "'Space Mono', monospace" }}>localhost</span> only.
          Deployed sites require a paid plan.
        </p>

        <div className="flex gap-2 mt-3">
          <input
            type="password"
            placeholder="Paste your NewsAPI key here…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoComplete="off"
            className="flex-1 rounded-md px-3 py-2 outline-none transition-all duration-200"
            style={{
              background: "rgba(255,179,71,0.05)",
              border: "1px solid rgba(255,179,71,0.18)",
              color: "#f0f0f5",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.04em",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(255,179,71,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,179,71,0.18)")
            }
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md font-bold cursor-pointer transition-all hover:opacity-85"
            style={{
              background: "#ffb347",
              color: "#050505",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              border: "none",
              whiteSpace: "nowrap",
            }}
          >
            ACTIVATE
          </button>
        </div>
      </div>
    </div>
  );
}
