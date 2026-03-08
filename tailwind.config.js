/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        deep: "#0a0a0f",
        surface: "#0f0f1a",
        "panic-red": "#FF0000",
        "electric-blue": "#00d4ff",
        amber: "#ffb347",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "logo-glow": "logoGlow 2s ease-in-out infinite",
        "live-pulse": "livePulse 1.2s ease-in-out infinite",
        "badge-pulse": "badgePulse 1.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        ticker: "tickerScroll 40s linear infinite",
        "panic-bar": "panicBar 1s linear infinite",
        "blob-pulse": "blobPulse 8s ease-in-out infinite",
        "card-in": "cardFadeIn 0.4s ease forwards",
        "panic-shake": "panicShake 0.4s ease",
      },
      keyframes: {
        logoGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(255,0,0,0.4), 0 0 40px rgba(255,0,0,0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(255,0,0,0.6), 0 0 60px rgba(255,0,0,0.3)" },
        },
        livePulse: {
          "0%,100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.4, transform: "scale(0.8)" },
        },
        badgePulse: {
          "0%,100%": { boxShadow: "0 0 12px rgba(255,0,0,0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(255,0,0,0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        tickerScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        panicBar: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        blobPulse: {
          "0%,100%": { opacity: 0.6, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.1)" },
        },
        cardFadeIn: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        panicShake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-3px) rotate(-1deg)" },
          "40%": { transform: "translateX(3px) rotate(1deg)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },
      },
      backdropBlur: { xl: "24px" },
    },
  },
  plugins: [],
};
