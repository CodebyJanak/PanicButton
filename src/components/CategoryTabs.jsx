import React, { useRef, useState, useEffect } from "react";
import { ALL_CATEGORIES, LOCAL_TAB } from "../utils/constants";

const TABS = [...ALL_CATEGORIES, LOCAL_TAB];

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);
  const [showLeft,  setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", checkScroll);
      el?.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  return (
    <div className="sticky z-40" style={{
      top: "64px",
      background: "rgba(5,5,5,0.93)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div className="max-w-screen-xl mx-auto px-4 relative flex items-center">
        {showLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2"
            style={{ background: "linear-gradient(to right, rgba(5,5,5,0.97) 70%, transparent)", paddingRight: "16px" }}>
            <button onClick={() => scroll(-1)} className="cursor-pointer" style={{ color: "#8888aa", background: "none", border: "none", fontSize: "18px", lineHeight: 1 }}>‹</button>
          </div>
        )}

        <div ref={scrollRef} className="flex items-center gap-0.5 py-2.5 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
          {TABS.map((tab, idx) => {
            const active = activeCategory === tab.id;
            const isLocal = tab.id === "local";
            return (
              <React.Fragment key={tab.id}>
                {/* Divider before "Near You" */}
                {isLocal && (
                  <div className="flex-shrink-0 mx-2" style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.07)" }} />
                )}
                <button
                  onClick={() => onCategoryChange(tab.id)}
                  className="flex items-center gap-2 whitespace-nowrap rounded-md cursor-pointer transition-all duration-200 flex-shrink-0"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "9.5px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "7px 13px",
                    background: active ? tab.accentDim : "transparent",
                    color: active ? tab.accent : "#555570",
                    border: active ? `1px solid ${tab.accentBorder}` : "1px solid transparent",
                    boxShadow: active ? `0 0 12px ${tab.accentDim}` : "none",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#8888aa"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#555570"; e.currentTarget.style.background = "transparent"; }}}
                >
                  <span style={{ fontSize: "12px" }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {showRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-2"
            style={{ background: "linear-gradient(to left, rgba(5,5,5,0.97) 70%, transparent)", paddingLeft: "16px" }}>
            <button onClick={() => scroll(1)} className="cursor-pointer" style={{ color: "#8888aa", background: "none", border: "none", fontSize: "18px", lineHeight: 1 }}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
