import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { SUPPORTED_COUNTRIES } from '../utils/constants';

// In production: /api/news → Express proxy → NewsAPI (server-side, key hidden)
// In dev: CRA proxy forwards /api/news → localhost:3001
const NEWS_BASE = '/api/news';

export default function useNews(apiKey, language = 'en') {
  const [categoryNews,    setCategoryNews]    = useState({});
  const [categoryLoading, setCategoryLoading] = useState({});
  const [categoryError,   setCategoryError]   = useState({});
  const [localNews,       setLocalNews]       = useState([]);
  const [loadingLocal,    setLoadingLocal]    = useState(false);
  const [errorLocal,      setErrorLocal]      = useState(null);
  const [searchResults,   setSearchResults]   = useState([]);
  const [searchLoading,   setSearchLoading]   = useState(false);
  const [searchError,     setSearchError]     = useState(null);
  const [lastQuery,       setLastQuery]       = useState('');
  const [countryCode,     setCountryCode]     = useState(null);
  const [countryName,     setCountryName]     = useState(null);
  const [locationStatus,  setLocationStatus]  = useState('idle');
  const locks = useRef({});

  const fetchArticles = useCallback(async (url, onSuccess, onError, lockKey, force = false) => {
    if (!force && locks.current[lockKey]) return;
    locks.current[lockKey] = true;
    try {
      const res = await axios.get(url, { timeout: 12000 });
      const articles = (res.data.articles || []).filter(
        a => a.title && a.title !== '[Removed]' && a.url
      );
      onSuccess(articles);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Network error';
      onError(msg);
    } finally {
      locks.current[lockKey] = false;
    }
  }, []);

  const fetchCategory = useCallback((catId, query, force = false) => {
    setCategoryLoading(prev => ({ ...prev, [catId]: true }));
    setCategoryError(prev => ({ ...prev, [catId]: null }));
    const lang = language || 'en';
    let url;
    if (query) {
      url = `${NEWS_BASE}/everything?q=${encodeURIComponent(query)}&pageSize=20&language=${lang}&sortBy=publishedAt`;
    } else {
      url = `${NEWS_BASE}/top-headlines?category=${catId}&pageSize=20&language=${lang}`;
    }
    fetchArticles(url,
      articles => {
        setCategoryNews(prev => ({ ...prev, [catId]: articles }));
        setCategoryLoading(prev => ({ ...prev, [catId]: false }));
      },
      msg => {
        setCategoryError(prev => ({ ...prev, [catId]: msg }));
        setCategoryNews(prev => ({ ...prev, [catId]: [] }));
        setCategoryLoading(prev => ({ ...prev, [catId]: false }));
      },
      `cat_${catId}`, force
    );
  }, [language, fetchArticles]);

  const fetchLocal = useCallback((code) => {
    const safeCode = SUPPORTED_COUNTRIES.has(code) ? code : 'us';
    setLoadingLocal(true); setErrorLocal(null);
    const url = `${NEWS_BASE}/top-headlines?country=${safeCode}&pageSize=20`;
    fetchArticles(url,
      articles => { setLocalNews(articles); setLoadingLocal(false); },
      msg      => { setErrorLocal(msg); setLocalNews([]); setLoadingLocal(false); },
      'local', true
    );
  }, [fetchArticles]);

  const searchNews = useCallback((query) => {
    if (!query.trim()) return;
    const q = query.trim();
    setLastQuery(q); setSearchLoading(true); setSearchError(null); setSearchResults([]);
    const url = `${NEWS_BASE}/everything?q=${encodeURIComponent(q)}&pageSize=30&language=${language || 'en'}&sortBy=relevancy`;
    fetchArticles(url,
      articles => { setSearchResults(articles); setSearchLoading(false); },
      msg      => { setSearchError(msg); setSearchLoading(false); },
      'search', true
    );
  }, [language, fetchArticles]);

  const detectLocation = useCallback(() => {
    setLocationStatus('detecting');
    const applyCode = (code, name, status) => {
      const safe = (code || 'us').toLowerCase();
      setCountryCode(safe); setCountryName(name || safe.toUpperCase());
      setLocationStatus(status); fetchLocal(safe);
    };
    const fetchByIP = (status = 'ip') => {
      const services = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/?fields=countryCode,country'
      ];
      const tryNext = (idx = 0) => {
        if (idx >= services.length) { applyCode('us', 'United States', 'denied'); return; }
        axios.get(services[idx], { timeout: 6000 })
          .then(res => {
            const d = res.data;
            if (d.country_code) { applyCode(d.country_code, d.country_name, status); return; }
            if (d.countryCode)  { applyCode(d.countryCode,  d.country,      status); return; }
            tryNext(idx + 1);
          }).catch(() => tryNext(idx + 1));
      };
      tryNext();
    };
    if (!navigator.geolocation) { fetchByIP('ip'); return; }
    navigator.geolocation.getCurrentPosition(
      () => fetchByIP('done'),
      () => fetchByIP('denied'),
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [fetchLocal]);

  const clearSearch = useCallback(() => {
    setSearchResults([]); setSearchError(null); setLastQuery('');
  }, []);

  return {
    categoryNews, categoryLoading, categoryError,
    localNews, loadingLocal, errorLocal,
    searchResults, searchLoading, searchError, lastQuery,
    countryCode, countryName, locationStatus,
    fetchCategory, fetchLocal, searchNews, clearSearch, detectLocation,
  };
}
