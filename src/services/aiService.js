// ── AI SERVICE — powered by Google Gemini Flash (FREE) ───────────────────────
// All calls go through /api/ai/gemini (Express proxy, keeps API key server-side)
// Free tier: 15 RPM, 1M tokens/day — more than enough for a news app

const GEMINI_MODEL = 'gemini-1.5-flash';

async function callGemini(systemPrompt, userPrompt, maxTokens = 1000) {
  const response = await fetch('/api/ai/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      systemPrompt,
      userPrompt,
      maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}

function parseJSON(raw) {
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    // Try extracting JSON from within the text
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return null;
  }
}

export async function summarizeArticle(article) {
  const system = 'You are a concise news summarizer. Respond ONLY with valid JSON, no markdown fences: {"bullets":["point 1.","point 2.","point 3."],"readTime":2,"keyFact":"The most important single fact."}';
  const user   = `Title: ${article.title}\nSource: ${article.source?.name || 'Unknown'}\nDescription: ${article.description || ''}\nContent: ${(article.content || '').substring(0, 500)}`;
  const raw    = await callGemini(system, user);
  return parseJSON(raw) || { bullets: [article.description || 'Summary unavailable.'], readTime: 1, keyFact: '' };
}

export async function analyzeSentiment(headlines) {
  const system = 'You are a sentiment analyzer. Respond ONLY with valid JSON, no markdown fences: {"positive":25,"negative":50,"neutral":25,"score":-0.3,"dominantTheme":"geopolitical tension","mood":"anxious"}';
  const user   = 'Analyze these news headlines:\n' + headlines.slice(0, 30).map((h, i) => `${i + 1}. ${h}`).join('\n');
  const raw    = await callGemini(system, user);
  return parseJSON(raw) || { positive: 33, negative: 34, neutral: 33, score: 0, dominantTheme: 'mixed news', mood: 'neutral' };
}

export async function extractTrendingTopics(articles) {
  const system = 'Extract trending topics. Respond ONLY with a valid JSON array, no markdown fences: [{"word":"topic","count":15,"category":"politics"}]';
  const titles = articles.map(a => a.title).filter(Boolean).slice(0, 50).join(' | ');
  const user   = 'Extract top 15 trending topics from these headlines: ' + titles;
  const raw    = await callGemini(system, user);
  const result = parseJSON(raw);
  return Array.isArray(result) ? result : [];
}

export async function detectBias(article) {
  const system = 'You are a media bias analyzer. Respond ONLY with valid JSON, no markdown fences: {"bias":"center","confidence":0.8,"reasoning":"One sentence explanation.","political_leaning":0.1} where bias is "left"|"center"|"right"|"unknown" and political_leaning is -1(far left) to +1(far right).';
  const user   = `Analyze political bias:\nTitle: ${article.title}\nSource: ${article.source?.name || 'Unknown'}\nDescription: ${article.description || ''}`;
  const raw    = await callGemini(system, user, 400);
  return parseJSON(raw) || { bias: 'unknown', confidence: 0, reasoning: 'Analysis unavailable.', political_leaning: 0 };
}

export async function checkFakeNews(article) {
  const system = 'You are a fact-checker. Respond ONLY with valid JSON, no markdown fences: {"credibility":"medium","score":0.7,"flags":["sensational headline"],"verdict":"One sentence verdict."} where credibility is "high"|"medium"|"low"|"suspicious".';
  const user   = `Fact-check this article:\nTitle: ${article.title}\nSource: ${article.source?.name || 'Unknown'}\nDescription: ${article.description || ''}`;
  const raw    = await callGemini(system, user, 500);
  return parseJSON(raw) || { credibility: 'unknown', score: 0.5, flags: [], verdict: 'Unable to verify.' };
}

export async function chatWithNews(userMessage, articles, history = []) {
  const context = articles.slice(0, 20).map(a => `• ${a.title} (${a.source?.name || 'Unknown'})`).join('\n');
  const historyText = history.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
  const system = `You are a smart news assistant. Answer questions about current events based on today's headlines. Be concise and factual.\n\nToday's articles:\n${context}`;
  const user   = historyText ? `${historyText}\nUser: ${userMessage}` : userMessage;
  return await callGemini(system, user, 600);
}

export async function generateDailyBriefing(allArticles) {
  if (!allArticles || allArticles.length === 0) {
    throw new Error('No articles loaded yet. Please wait for news to load first.');
  }
  const system = 'You are a professional news anchor. Respond ONLY with valid JSON, no markdown fences: {"headline":"Main story in 1 sentence.","sections":[{"category":"Politics","summary":"2-3 sentence summary."},{"category":"Technology","summary":"..."}],"closingNote":"Upbeat closing remark."}';
  const titles = allArticles.slice(0, 30).map(a => `• ${a.title}`).join('\n');
  const user   = `Generate a daily news briefing from these headlines:\n${titles}`;
  const raw    = await callGemini(system, user, 1000);
  const result = parseJSON(raw);
  if (!result) throw new Error('Failed to generate briefing. Please try again.');
  return result;
}

export async function translateArticle(article, targetLang = 'English') {
  const system = `Translate to ${targetLang}. Respond ONLY with valid JSON, no markdown fences: {"title":"translated title","description":"translated description","translatedFrom":"detected language"}`;
  const user   = `Title: ${article.title}\nDescription: ${article.description || ''}`;
  const raw    = await callGemini(system, user, 600);
  return parseJSON(raw) || { title: article.title, description: article.description, translatedFrom: 'unknown' };
}
