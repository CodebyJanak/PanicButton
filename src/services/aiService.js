const AI_MODEL = 'claude-sonnet-4-20250514';

async function callClaude(systemPrompt, userPrompt, maxTokens = 1000) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'HTTP ' + response.status);
  }
  const data = await response.json();
  return data.content?.find(b => b.type === 'text')?.text || '';
}

export async function summarizeArticle(article) {
  const system = 'You are a concise news summarizer. Respond ONLY with valid JSON: {"bullets":["point 1.","point 2.","point 3."],"readTime":2,"keyFact":"The most important single fact."} No markdown.';
  const user = `Title: ${article.title}\nSource: ${article.source?.name||'Unknown'}\nDescription: ${article.description||''}\nContent: ${(article.content||'').substring(0,500)}`;
  const raw = await callClaude(system, user);
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
  catch { return { bullets:[article.description||'Summary unavailable.'], readTime:1, keyFact:'' }; }
}

export async function analyzeSentiment(headlines) {
  const system = 'You are a sentiment analyzer. Respond ONLY with valid JSON: {"positive":25,"negative":50,"neutral":25,"score":-0.3,"dominantTheme":"geopolitical tension","mood":"anxious"} No extra text.';
  const user = 'Analyze these headlines:\n' + headlines.slice(0,30).map((h,i) => `${i+1}. ${h}`).join('\n');
  const raw = await callClaude(system, user);
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
  catch { return { positive:33, negative:34, neutral:33, score:0, dominantTheme:'mixed news', mood:'neutral' }; }
}

export async function extractTrendingTopics(articles) {
  const system = 'Topic extractor. Respond ONLY with valid JSON array: [{"word":"topic","count":15,"category":"politics"}] No markdown.';
  const titles = articles.map(a=>a.title).filter(Boolean).slice(0,50).join(' | ');
  const user = 'Extract top 20 trending topics from: ' + titles;
  const raw = await callClaude(system, user);
  try { const arr = JSON.parse(raw.replace(/```json|```/g,'').trim()); return Array.isArray(arr)?arr:[]; }
  catch { return []; }
}

export async function detectBias(article) {
  const system = 'You are a media bias analyzer. Respond ONLY with valid JSON: {"bias":"left"|"center"|"right","confidence":0.8,"reasoning":"Brief 1-sentence explanation.","political_leaning":0.3} where political_leaning is -1(far left) to +1(far right). No markdown.';
  const user = `Analyze the political bias of this article:\nTitle: ${article.title}\nSource: ${article.source?.name||'Unknown'}\nDescription: ${article.description||''}\nContent: ${(article.content||'').substring(0,400)}`;
  const raw = await callClaude(system, user, 400);
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
  catch { return { bias:'unknown', confidence:0, reasoning:'Analysis unavailable.', political_leaning:0 }; }
}

export async function checkFakeNews(article) {
  const system = 'You are a fact-checker. Respond ONLY with valid JSON: {"credibility":"high"|"medium"|"low"|"suspicious","score":0.8,"flags":["flag1","flag2"],"verdict":"Brief verdict sentence."} No markdown.';
  const user = `Fact-check this article:\nTitle: ${article.title}\nSource: ${article.source?.name||'Unknown'}\nDescription: ${article.description||''}\nContent: ${(article.content||'').substring(0,400)}`;
  const raw = await callClaude(system, user, 500);
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
  catch { return { credibility:'unknown', score:0.5, flags:[], verdict:'Unable to verify.' }; }
}

export async function translateArticle(article, targetLang='English') {
  const system = `You are a translator. Translate the following news article to ${targetLang}. Respond ONLY with valid JSON: {"title":"translated title","description":"translated description","translatedFrom":"detected language"} No markdown.`;
  const user = `Title: ${article.title}\nDescription: ${article.description||''}`;
  const raw = await callClaude(system, user, 600);
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
  catch { return { title:article.title, description:article.description, translatedFrom:'unknown' }; }
}

export async function chatWithNews(userMessage, articles, history=[]) {
  const system = `You are a smart news assistant with access to today's top headlines. Answer questions about current events based on the provided articles. Be concise and factual. Current articles context:\n${articles.slice(0,20).map(a=>`• ${a.title} (${a.source?.name||'Unknown'})`).join('\n')}`;
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: AI_MODEL, max_tokens: 600, system, messages }),
  });
  if (!response.ok) throw new Error('Chat failed');
  const data = await response.json();
  return data.content?.find(b=>b.type==='text')?.text || 'No response.';
}

export async function generateDailyBriefing(allArticles) {
  const system = 'You are a professional news anchor. Generate a concise daily briefing. Respond ONLY with valid JSON: {"headline":"Main story in 1 sentence.","sections":[{"category":"Politics","summary":"2-3 sentence summary."},{"category":"Business","summary":"..."}],"closingNote":"Upbeat closing remark."} No markdown.';
  const grouped = {};
  allArticles.slice(0,40).forEach(a => {
    const cat = a._category || 'general';
    if(!grouped[cat]) grouped[cat]=[];
    if(grouped[cat].length < 3) grouped[cat].push(a.title);
  });
  const user = 'Generate a daily briefing from these headlines:\n' + Object.entries(grouped).map(([cat,titles])=>`${cat}: ${titles.join(' | ')}`).join('\n');
  const raw = await callClaude(system, user, 1000);
  try { return JSON.parse(raw.replace(/```json|```/g,'').trim()); }
  catch { return null; }
}
