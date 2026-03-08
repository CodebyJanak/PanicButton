import React from "react";

export default function Footer() {
  const now = new Date().toUTCString().substring(0, 25);

  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-3 px-6 py-5"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          color: "#555570",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ color: "#FF0000" }}>PANIC BUTTON</span> — Live Intelligence Feed
      </span>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          color: "#555570",
          letterSpacing: "0.06em",
        }}
      >
        Powered by{" "}
        <a
          href="https://newsapi.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#8888aa", textDecoration: "none" }}
        >
          NewsAPI.org
        </a>{" "}
        · {now}
      </span>
    </footer>
  );
}
