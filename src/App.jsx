import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppProvider, useAppStore } from './store/appStore';
import Navbar              from './components/Navbar';
import PanicModeBar        from './components/PanicModeBar';
import CategoryTabs        from './components/CategoryTabs';
import CategorySection     from './components/CategorySection';
import LocalNewsSection    from './components/LocalNewsSection';
import SearchModal         from './components/SearchModal';
import NewsTicker          from './components/NewsTicker';
import Footer              from './components/Footer';
import BookmarksPanel      from './components/BookmarksPanel';
import SettingsPanel       from './components/SettingsPanel';
import AISummaryModal      from './components/AISummaryModal';
import ShareCardModal      from './components/ShareCardModal';
import BreakingOverlay     from './components/BreakingOverlay';
import OfflineBanner       from './components/OfflineBanner';
import AutoRefreshBar      from './components/AutoRefreshBar';
import SentimentMeter      from './components/SentimentMeter';
import TrendingTopics      from './components/TrendingTopics';
import WorldHeatmap        from './components/WorldHeatmap';
import CategoryDistributionChart from './components/CategoryDistributionChart';
import PublicationTimeline from './components/PublicationTimeline';
import BootScreen          from './components/BootScreen';
import ReadingProgressBar  from './components/ReadingProgressBar';
import AskNewsChat         from './components/AskNewsChat';
import BiasDetector        from './components/BiasDetector';
import FakeNewsChecker     from './components/FakeNewsChecker';
import DailyBriefing       from './components/DailyBriefing';
import KeywordAlerts       from './components/KeywordAlerts';
import SwipeCards          from './components/SwipeCards';
import useNews             from './hooks/useNews';
import useOnlineStatus     from './hooks/useOnlineStatus';
import { ALL_CATEGORIES }  from './utils/constants';
import { isBreaking }      from './utils/helpers';
import { sendBreakingAlert } from './services/notificationService';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}

function AppInner() {
  const { state: appState, dispatch } = useAppStore();
  const prefs = appState.preferences;

  const [booting,         setBooting]         = useState(true);
  const [activeCategory,  setActiveCategory]  = useState('general');
  const [panicMode,       setPanicMode]       = useState(false);
  const [searchOpen,      setSearchOpen]      = useState(false);
  const [bookmarksOpen,   setBookmarksOpen]   = useState(false);
  const [settingsOpen,    setSettingsOpen]    = useState(false);
  const [chatOpen,        setChatOpen]        = useState(false);
  const [briefingOpen,    setBriefingOpen]    = useState(false);
  const [alertsOpen,      setAlertsOpen]      = useState(false);
  const [swipeOpen,       setSwipeOpen]       = useState(false);
  const [aiArticle,       setAiArticle]       = useState(null);
  const [shareArticle,    setShareArticle]    = useState(null);
  const [biasArticle,     setBiasArticle]     = useState(null);
  const [fakeArticle,     setFakeArticle]     = useState(null);
  const [breakingArticle, setBreakingArticle] = useState(null);
  const [newArticleCount, setNewArticleCount] = useState(0);
  const [initialized,     setInitialized]     = useState(false);
  const prevArticleUrls = useRef(new Set());
  const online = useOnlineStatus();

  // No client-side API key needed — server proxy handles it
  const {
    categoryNews, categoryLoading, categoryError,
    localNews, loadingLocal, errorLocal,
    searchResults, searchLoading, searchError, lastQuery,
    countryCode, countryName, locationStatus,
    fetchCategory, detectLocation, searchNews, clearSearch,
  } = useNews(null, prefs.language);

  // Boot
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 4200);
    return () => clearTimeout(t);
  }, []);

  // Init on mount
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      fetchCategory('general');
      detectLocation();
      if (prefs.showBriefingOnLoad) setTimeout(() => setBriefingOpen(true), 1000);
    }
  }, [initialized, fetchCategory, detectLocation, prefs.showBriefingOnLoad]);

  // Auto-refresh
  const handleAutoRefresh = useCallback(() => {
    const cat = activeCategory === 'local' ? 'general' : activeCategory;
    const catDef = ALL_CATEGORIES.find(c => c.id === cat);
    fetchCategory(cat, catDef?.query, true);
    if (activeCategory === 'local') detectLocation();
  }, [activeCategory, fetchCategory, detectLocation]);

  // New article detection + breaking news check
  useEffect(() => {
    const current = categoryNews[activeCategory] || [];
    if (current.length === 0) return;
    const currentUrls = new Set(current.map(a => a.url));
    if (prevArticleUrls.current.size > 0) {
      let count = 0;
      currentUrls.forEach(url => { if (!prevArticleUrls.current.has(url)) count++; });
      if (count > 0) setNewArticleCount(count);
      const newBreaking = current.find(a => !prevArticleUrls.current.has(a.url) && isBreaking(a));
      if (newBreaking) {
        setBreakingArticle(newBreaking);
        if (prefs.notificationsEnabled) sendBreakingAlert(newBreaking);
      }
    }
    prevArticleUrls.current = currentUrls;
  }, [categoryNews, activeCategory, prefs.notificationsEnabled]);

  // Keyword alert matching
  const allArticles = Object.values(categoryNews).flat();
  const matchedAlerts = allArticles.filter(a => {
    const text = ((a.title || '') + (a.description || '')).toLowerCase();
    const matched = appState.keywordAlerts.find(kw => text.includes(kw));
    if (matched) { a._matchedKeyword = matched; return true; }
    return false;
  });

  const handleCategoryChange = useCallback(catId => {
    setActiveCategory(catId);
    setNewArticleCount(0);
    if (catId !== 'local' && !categoryNews[catId] && !categoryLoading[catId]) {
      const cat = ALL_CATEGORIES.find(c => c.id === catId);
      fetchCategory(catId, cat?.query);
    }
  }, [categoryNews, categoryLoading, fetchCategory]);

  // Cmd+K shortcut
  useEffect(() => {
    const h = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); } };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  // Theme
  useEffect(() => {
    const r = document.documentElement;
    if (prefs.theme === 'oled') {
      r.style.setProperty('--void', '#000000'); r.style.setProperty('--deep', '#000000'); r.style.setProperty('--surface', '#030305');
    } else if (prefs.theme === 'light') {
      r.style.setProperty('--void', '#f5f5f8'); r.style.setProperty('--deep', '#ffffff'); r.style.setProperty('--surface', '#fafafa');
      document.body.style.color = '#1a1a2e';
    } else {
      r.style.setProperty('--void', '#030308'); r.style.setProperty('--deep', '#07070f'); r.style.setProperty('--surface', '#0c0c18');
      document.body.style.color = 'var(--text-1)';
    }
  }, [prefs.theme]);

  // Voice commands
  const handleVoiceCommand = useCallback(cmd => {
    if (cmd.action === 'category')   handleCategoryChange(cmd.value);
    else if (cmd.action === 'search') { setSearchOpen(true); if (cmd.value) searchNews(cmd.value); }
    else if (cmd.action === 'panic')  setPanicMode(p => !p);
    else if (cmd.action === 'briefing')  setBriefingOpen(true);
    else if (cmd.action === 'bookmarks') setBookmarksOpen(true);
  }, [handleCategoryChange, searchNews]);

  const activeCatDef   = ALL_CATEGORIES.find(c => c.id === activeCategory) || ALL_CATEGORIES[0];
  const tickerArticles = categoryNews['general'] || categoryNews[activeCategory] || [];
  const sharedCardProps = { onAISummary: setAiArticle, onShare: setShareArticle, onBiasCheck: setBiasArticle, onFakeCheck: setFakeArticle };

  return (
    <div className={panicMode ? 'panic-mode-active' : ''} style={{ minHeight: '100vh', background: 'var(--void)', position: 'relative' }}>
      {booting && <BootScreen onDone={() => setBooting(false)} />}
      <ReadingProgressBar />
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

      <Navbar panicMode={panicMode} onPanicToggle={() => setPanicMode(p => !p)}
        onSearchOpen={() => setSearchOpen(true)} onBookmarks={() => setBookmarksOpen(true)}
        onSettings={() => setSettingsOpen(true)} online={online}
        onChat={() => setChatOpen(true)} onBriefing={() => setBriefingOpen(true)}
        onAlerts={() => setAlertsOpen(true)} onSwipe={() => setSwipeOpen(true)}
        onVoiceCommand={handleVoiceCommand} />

      <CategoryTabs activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      {panicMode && <PanicModeBar onDeactivate={() => setPanicMode(false)} />}
      {prefs.autoRefresh && (
        <AutoRefreshBar enabled={prefs.autoRefresh} intervalSeconds={prefs.refreshInterval}
          onRefresh={handleAutoRefresh} newCount={newArticleCount} />
      )}

      {/* All modals & panels */}
      <SearchModal isOpen={searchOpen} onClose={() => { setSearchOpen(false); clearSearch(); }}
        onSearch={searchNews} results={searchResults} loading={searchLoading} error={searchError} lastQuery={lastQuery} />
      <BookmarksPanel    isOpen={bookmarksOpen}  onClose={() => setBookmarksOpen(false)} />
      <SettingsPanel     isOpen={settingsOpen}   onClose={() => setSettingsOpen(false)} onClearApiKey={() => {}} />
      <AISummaryModal    article={aiArticle}     onClose={() => setAiArticle(null)} />
      <ShareCardModal    article={shareArticle}  onClose={() => setShareArticle(null)} />
      <AskNewsChat       isOpen={chatOpen}       onClose={() => setChatOpen(false)} articles={allArticles} />
      <DailyBriefing     isOpen={briefingOpen}   onClose={() => setBriefingOpen(false)} articles={allArticles} />
      <KeywordAlerts     isOpen={alertsOpen}     onClose={() => setAlertsOpen(false)} matchedArticles={matchedAlerts} />
      <SwipeCards        isOpen={swipeOpen}      onClose={() => setSwipeOpen(false)} articles={allArticles.slice(0, 30)} />
      {biasArticle  && <BiasDetector    article={biasArticle}  onClose={() => setBiasArticle(null)} />}
      {fakeArticle  && <FakeNewsChecker article={fakeArticle}  onClose={() => setFakeArticle(null)} />}
      {breakingArticle && <BreakingOverlay article={breakingArticle} onDismiss={() => setBreakingArticle(null)} notificationsEnabled={prefs.notificationsEnabled} />}
      <OfflineBanner online={online} />

      {/* Main content */}
      <main className="relative z-10 max-w-screen-xl mx-auto" style={{ padding: '28px 20px 80px' }}>
        <div className="flex gap-6">
          {/* Feed */}
          <div className="flex-1 min-w-0">
            {tickerArticles.length > 0 && <NewsTicker articles={tickerArticles} />}
            {activeCategory === 'local' ? (
              <LocalNewsSection articles={localNews} loading={loadingLocal} error={errorLocal}
                countryCode={countryCode} countryName={countryName} locationStatus={locationStatus}
                panicMode={panicMode} onRetry={detectLocation} density={prefs.density} {...sharedCardProps} />
            ) : (
              <CategorySection category={activeCatDef}
                articles={categoryNews[activeCategory] || []}
                loading={!!categoryLoading[activeCategory]}
                error={categoryError[activeCategory] || null}
                panicMode={panicMode}
                onRetry={() => fetchCategory(activeCategory, activeCatDef?.query)}
                density={prefs.density}
                {...sharedCardProps} />
            )}
          </div>

          {/* Intelligence sidebar */}
          <aside className="hidden xl:flex flex-col gap-4" style={{ width: '280px', flexShrink: 0 }}>
            <SentimentMeter     articles={allArticles.slice(0, 50)} />
            <TrendingTopics     articles={allArticles.slice(0, 50)} />
            <CategoryDistributionChart categoryNews={categoryNews} />
            <PublicationTimeline articles={allArticles} onArticleClick={setAiArticle} />
            <WorldHeatmap       articles={allArticles.slice(0, 80)} />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
