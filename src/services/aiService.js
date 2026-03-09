// ── AI SERVICE — Google Gemini 1.5 Flash (FREE) ───────────────────────────────
// Proxy: browser → /api/ai/gemini → Express server → Gemini API
// Free: 15 req/min, 1M tokens/day at https://aistudio.google.com/apikey

async function callGemini(systemPrompt, userPrompt, maxTokens = 1000) {
  const response = await fetch('/api/ai/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userPrompt, maxTokens }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // Show the real error so user knows what's wrong
    throw new Error(data.error || `AI server error (${response.status})`)
  }

  return data.text || ''
}

function parseJSON(raw) {
  if (!raw) return null
  // Remove markdown code fences if present
  const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  try { return JSON.parse(clean) } catch {}
  // Try to extract JSON object or array from response
  const objMatch = clean.match(/\{[\s\S]*\}/)
  const arrMatch = clean.match(/\[[\s\S]*\]/)
  if (objMatch) { try { return JSON.parse(objMatch[0]) } catch {} }
  if (arrMatch) { try { return JSON.parse(arrMatch[0]) } catch {} }
  return null
}

// ── ARTICLE SUMMARY ───────────────────────────────────────────────────────────
export async function summarizeArticle(article) {
  const system = `You are a news summarizer. You MUST respond with ONLY a JSON object, no other text, no markdown:
{"bullets":["key point 1","key point 2","key point 3"],"readTime":2,"keyFact":"most important fact"}`

  const user = `Summarize this article:
Title: ${article.title}
Source: ${article.source?.name || 'Unknown'}
Description: ${article.description || 'No description'}
Content: ${(article.content || '').substring(0, 600)}`

  const raw = await callGemini(system, user, 500)
  return parseJSON(raw) || {
    bullets: [article.description || 'No summary available'],
    readTime: 1,
    keyFact: article.title
  }
}

// ── SENTIMENT ANALYSIS ────────────────────────────────────────────────────────
export async function analyzeSentiment(headlines) {
  const system = `You are a sentiment analyzer. Respond with ONLY a JSON object, no other text:
{"positive":30,"negative":45,"neutral":25,"score":-0.2,"dominantTheme":"global economy","mood":"anxious"}`

  const user = `Analyze the overall sentiment of these ${headlines.length} news headlines:
${headlines.slice(0, 25).map((h, i) => `${i + 1}. ${h}`).join('\n')}`

  const raw = await callGemini(system, user, 300)
  return parseJSON(raw) || { positive: 33, negative: 34, neutral: 33, score: 0, dominantTheme: 'world news', mood: 'neutral' }
}

// ── TRENDING TOPICS ───────────────────────────────────────────────────────────
export async function extractTrendingTopics(articles) {
  const system = `Extract trending topics. Respond with ONLY a JSON array, no other text:
[{"word":"climate","count":12,"category":"environment"},{"word":"election","count":8,"category":"politics"}]`

  const titles = articles.map(a => a.title).filter(Boolean).slice(0, 40).join(' | ')
  const user   = `Find the top 15 trending topics in these headlines: ${titles}`

  const raw    = await callGemini(system, user, 600)
  const result = parseJSON(raw)
  return Array.isArray(result) ? result : []
}

// ── BIAS DETECTOR ─────────────────────────────────────────────────────────────
export async function detectBias(article) {
  const system = `You are a media bias analyzer. Respond with ONLY a JSON object, no other text:
{"bias":"center","confidence":0.75,"reasoning":"Brief one-sentence reason.","political_leaning":0.1}
bias must be one of: "left", "center", "right", "unknown"
political_leaning: -1 = far left, 0 = center, +1 = far right`

  const user = `Analyze the political bias of this article:
Title: ${article.title}
Source: ${article.source?.name || 'Unknown'}
Description: ${article.description || ''}`

  const raw = await callGemini(system, user, 400)
  return parseJSON(raw) || { bias: 'unknown', confidence: 0, reasoning: 'Analysis unavailable.', political_leaning: 0 }
}

// ── FACT CHECKER ──────────────────────────────────────────────────────────────
export async function checkFakeNews(article) {
  const system = `You are a fact-checker. Respond with ONLY a JSON object, no other text:
{"credibility":"medium","score":0.65,"flags":["unverified claim"],"verdict":"One sentence assessment."}
credibility must be one of: "high", "medium", "low", "suspicious"
score: 0.0 = not credible, 1.0 = fully credible`

  const user = `Assess the credibility of this news article:
Title: ${article.title}
Source: ${article.source?.name || 'Unknown'}
Description: ${article.description || ''}`

  const raw = await callGemini(system, user, 400)
  return parseJSON(raw) || { credibility: 'unknown', score: 0.5, flags: [], verdict: 'Unable to assess credibility.' }
}

// ── AI NEWS CHAT ──────────────────────────────────────────────────────────────
export async function chatWithNews(userMessage, articles, history = []) {
  const headlines = articles.slice(0, 20).map(a => `• ${a.title} (${a.source?.name || 'Unknown'})`).join('\n')

  const system = `You are a helpful news assistant. You have access to today's top headlines listed below.
Answer questions about current events based on these articles. Be concise, accurate, and conversational.
If asked about something not in the headlines, say so honestly.

TODAY'S HEADLINES:
${headlines}`

  // Build conversation context from history
  let user = userMessage
  if (history.length > 1) {
    const ctx = history.slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')
    user = `${ctx}\nUser: ${userMessage}`
  }

  return await callGemini(system, user, 600)
}

// ── DAILY BRIEFING ────────────────────────────────────────────────────────────
export async function generateDailyBriefing(allArticles) {
  if (!allArticles || allArticles.length === 0) {
    throw new Error('No articles loaded yet. Please wait a moment for news to load, then try again.')
  }

  const system = `You are a professional TV news anchor writing a daily briefing.
You MUST respond with ONLY a JSON object, absolutely no other text before or after:
{
  "headline": "The single most important story today in one sentence.",
  "sections": [
    {"category": "World", "summary": "2-3 sentence overview of world news."},
    {"category": "Technology", "summary": "2-3 sentence overview of tech news."},
    {"category": "Business", "summary": "2-3 sentence overview of business news."}
  ],
  "closingNote": "A brief upbeat closing sentence."
}`

  const headlines = allArticles.slice(0, 30).map((a, i) => `${i + 1}. ${a.title}`).join('\n')
  const user      = `Create a daily news briefing from these ${Math.min(allArticles.length, 30)} headlines:\n${headlines}`

  const raw    = await callGemini(system, user, 1200)
  const result = parseJSON(raw)

  if (!result || !result.headline) {
    throw new Error('AI returned an unexpected response. Please try again.')
  }

  return result
}

// ── TRANSLATE ─────────────────────────────────────────────────────────────────
export async function translateArticle(article, targetLang = 'English') {
  const system = `Translate to ${targetLang}. Respond with ONLY a JSON object, no other text:
{"title":"translated title","description":"translated description","translatedFrom":"detected source language"}`

  const user = `Translate:\nTitle: ${article.title}\nDescription: ${article.description || ''}`
  const raw  = await callGemini(system, user, 500)
  return parseJSON(raw) || { title: article.title, description: article.description, translatedFrom: 'unknown' }
}
