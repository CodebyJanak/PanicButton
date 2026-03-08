import { useState } from 'react';
const STORAGE_KEY = 'pb_news_api_key';
export default function useApiKey() {
  const [apiKey, setApiKeyState] = useState(
    () => process.env.REACT_APP_NEWS_API_KEY || localStorage.getItem(STORAGE_KEY) || ''
  );
  const saveApiKey = (key) => { const t = key.trim(); localStorage.setItem(STORAGE_KEY, t); setApiKeyState(t); };
  const clearApiKey = () => { localStorage.removeItem(STORAGE_KEY); setApiKeyState(''); };
  return { apiKey, saveApiKey, clearApiKey };
}
