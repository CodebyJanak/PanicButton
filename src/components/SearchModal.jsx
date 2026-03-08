import React, { useState, useEffect, useRef } from "react";
import NewsCard from "./NewsCard";
import { SkeletonCard } from "./SkeletonCard";

export default function SearchModal({ isOpen, onClose, onSearch, results, loading, error, lastQuery }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); if (!isOpen) return; }
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16 px-4 pb-8"
      style={{ background: "rgba(5,5,5,0.88)", backdropFilter: "blur(16px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxWidth: "800px",
          maxHeight: "80vh",
          background: "#0a0a0f",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,0,0,0.06)",
        }}
      >
        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: "18px", flexShrink: 0 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, keywords…"
            className="flex-1 outline-none bg-transparent"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "#f0f0f5",
              border: "none",
            }}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} style={{ color: "#555570", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>×</button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-2 rounded-md cursor-pointer transition-all duration-200 disabled:opacity-40 flex-shrink-0"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "#FF0000",
              color: "white",
              border: "none",
              boxShadow: "0 0 14px rgba(255,0,0,0.3)",
            }}
          >
            Search
          </button>
          <button type="button" onClick={onClose} style={{ color: "#555570", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.08em", flexShrink: 0 }}>ESC</button>
        </form>

        {/* Results area */}
        <div className="overflow-y-auto flex-1 p-5">
          {/* No query yet */}
          {!lastQuery && !loading && (
            <div className="flex flex-col items-center py-12 gap-3" style={{ color: "#555570" }}>
              <div style={{ fontSize: "42px", opacity: 0.3 }}>🔍</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.06em" }}>
                Type a query and press Enter or click Search
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {["AI news","Climate change","Stock market","Tech layoffs","Election 2024"].map(s => (
                  <button key={s} onClick={() => { setQuery(s); onSearch(s); }}
                    className="px-3 py-1.5 rounded-full cursor-pointer transition-all duration-150 hover:opacity-80"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.06em", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#8888aa" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div>
              <div className="mb-4" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#555570", letterSpacing: "0.06em" }}>
                Searching for "{lastQuery}"…
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div style={{ fontSize: "32px" }}>⚠️</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#FF0000", letterSpacing: "0.06em" }}>{error}</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#555570", letterSpacing: "0.06em" }}>
                  {results.length} results for <span style={{ color: "#f0f0f5" }}>"{lastQuery}"</span>
                </span>
              </div>
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                {results.map((article, i) => (
                  <NewsCard key={`${article.url}-${i}`} article={article} index={i} accentColor="#FF0000" />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && !error && lastQuery && results.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-3">
              <div style={{ fontSize: "38px", opacity: 0.3 }}>📭</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#555570", letterSpacing: "0.06em" }}>No results for "{lastQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
