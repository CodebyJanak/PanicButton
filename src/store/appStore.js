import React, { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'pb_state_v4';

const defaultState = {
  bookmarks: [],
  readHistory: [],
  keywordAlerts: [],
  readingStreak: { count:0, lastDate:null, bestStreak:0 },
  preferences: {
    theme:'void', density:'comfortable', language:'en',
    notificationsEnabled:false, autoRefresh:true, refreshInterval:300,
    accentColor:'#FF0000', nightModeAuto:false, voiceEnabled:false,
    showBriefingOnLoad:false, tabOrder:[],
  },
  lastRefresh: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState, ...parsed,
      preferences: { ...defaultState.preferences, ...(parsed.preferences||{}) },
      readingStreak: { ...defaultState.readingStreak, ...(parsed.readingStreak||{}) },
    };
  } catch { return defaultState; }
}

function updateStreak(streak) {
  const today = new Date().toDateString();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now()-86400000).toDateString();
  const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
  return { count:newCount, lastDate:today, bestStreak:Math.max(streak.bestStreak||0, newCount) };
}

function reducer(state, action) {
  switch (action.type) {
    case 'BOOKMARK_ADD': {
      if (state.bookmarks.find(b=>b.article.url===action.article.url)) return state;
      return { ...state, bookmarks:[{ article:action.article, savedAt:Date.now() }, ...state.bookmarks].slice(0,200) };
    }
    case 'BOOKMARK_REMOVE': return { ...state, bookmarks:state.bookmarks.filter(b=>b.article.url!==action.url) };
    case 'BOOKMARK_CLEAR': return { ...state, bookmarks:[] };
    case 'HISTORY_ADD': {
      const streak = updateStreak(state.readingStreak);
      const h = [action.url, ...state.readHistory.filter(u=>u!==action.url)].slice(0,500);
      return { ...state, readHistory:h, readingStreak:streak };
    }
    case 'HISTORY_CLEAR': return { ...state, readHistory:[] };
    case 'PREF_SET': return { ...state, preferences:{ ...state.preferences, [action.key]:action.value } };
    case 'LAST_REFRESH': return { ...state, lastRefresh:action.ts };
    case 'ALERT_ADD': {
      const kw = action.keyword.toLowerCase().trim();
      if (!kw || state.keywordAlerts.includes(kw)) return state;
      return { ...state, keywordAlerts:[...state.keywordAlerts, kw].slice(0,20) };
    }
    case 'ALERT_REMOVE': return { ...state, keywordAlerts:state.keywordAlerts.filter(k=>k!==action.keyword) };
    case 'ALERT_CLEAR': return { ...state, keywordAlerts:[] };
    default: return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);
  return React.createElement(AppContext.Provider, { value:{ state, dispatch } }, children);
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be inside AppProvider');
  return ctx;
}
