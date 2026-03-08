# 🚨 PANIC BUTTON — Live Intelligence Feed

A dark, futuristic news web application built with React.js and Tailwind CSS. Inspired by the **Space News** concept (ArsenUIUX on Dribbble).

![PANIC BUTTON Screenshot](https://via.placeholder.com/1200x630/050505/FF0000?text=PANIC+BUTTON)

---

## ✨ Features

- **Trending News** — Fetches top headlines via NewsAPI `/top-headlines?category=general`
- **Location-Based News** — Browser Geolocation API + ipapi.co reverse geocoding → ISO country code → local news
- **Panic Mode** — Red button that filters feed to only emergency/breaking news
- **Live Ticker** — Auto-scrolling headline strip
- **Glassmorphism Cards** — Semi-transparent cards with hover glow animations
- **Skeleton Loaders** — Shimmer skeletons matching the dark aesthetic
- **Broken Image Fallbacks** — Space-themed placeholder for failed image URLs
- **Custom `useNews` Hook** — Manages all API calls, loading & error states

---

## 🚀 Getting Started

### 1. Clone / Download

```bash
cd panic-button
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your NewsAPI key:

```
REACT_APP_NEWS_API_KEY=your_actual_newsapi_key_here
```

Get a free key at → **[https://newsapi.org](https://newsapi.org)**

> ⚠️ **Free tier limitation**: NewsAPI free tier only works on `localhost`. Deployed/production sites require a paid plan.

### 4. Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
panic-button/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation with tabs & panic button
│   │   ├── PanicModeBar.jsx     # Alert bar shown in panic mode
│   │   ├── ApiKeyBanner.jsx     # API key input banner
│   │   ├── HeroCard.jsx         # Featured breaking news hero
│   │   ├── NewsCard.jsx         # Glassmorphic news grid card
│   │   ├── SkeletonCard.jsx     # Loading skeleton states
│   │   ├── NewsTicker.jsx       # Auto-scrolling headline ticker
│   │   ├── FeedToggle.jsx       # Global / Local news toggle
│   │   ├── SectionHeader.jsx    # Section title + refresh
│   │   ├── ErrorState.jsx       # Error display
│   │   ├── EmptyState.jsx       # Empty feed display
│   │   └── Footer.jsx           # App footer
│   ├── hooks/
│   │   ├── useNews.js           # Core news fetching hook
│   │   └── useApiKey.js         # API key persistence hook
│   ├── utils/
│   │   ├── constants.js         # Supported countries, keywords, etc.
│   │   └── helpers.js           # timeAgo, isBreaking, safeImage, etc.
│   ├── App.jsx                  # Root component
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles + Tailwind
├── .env.example
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#050505` (void) |
| Surface | `#0a0a0f` (deep) |
| Panic Red | `#FF0000` |
| Electric Blue | `#00d4ff` |
| Amber | `#ffb347` |
| Font Display | Bebas Neue |
| Font Mono | Space Mono |
| Font Body | DM Sans |

---

## 🌍 Supported Countries (NewsAPI free)

NewsAPI supports ~54 countries for the `country` parameter. If the user's detected country is not in the list, the app automatically falls back to `us`.

---

## 🔧 Tech Stack

- **React 18** — UI framework
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client
- **Framer Motion** — Animation (available, optional)
- **date-fns** — Date formatting utilities
- **react-hot-toast** — Toast notifications (available, optional)
- **NewsAPI.org** — News data
- **ipapi.co** — IP-based reverse geocoding (no key needed)

---

## ⚙️ Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

---

## 📝 Notes

- The `REACT_APP_NEWS_API_KEY` in `.env` is the **recommended** way to set your key. Alternatively, you can paste it directly into the banner UI at runtime (saved in `localStorage`).
- Location is detected via `navigator.geolocation` and reverse-geocoded via `ipapi.co/json/` (free, no key required). If the user denies location, the app falls back to IP-based detection, then `us`.
