import express from 'express'
import axios   from 'axios'
import cors    from 'cors'
import path    from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '2mb' }))

// ── HEALTH CHECK — visit /api/health to verify server + keys ─────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    newsApiKey:    process.env.NEWS_API_KEY    ? '✅ set' : '❌ missing',
    geminiApiKey:  process.env.GEMINI_API_KEY  ? '✅ set' : '❌ missing',
    node:          process.version,
    time:          new Date().toISOString(),
  })
})

// ── NEWSAPI PROXY ─────────────────────────────────────────────────────────────
app.get('/api/news/*', async (req, res) => {
  const API_KEY = process.env.NEWS_API_KEY
  if (!API_KEY) return res.status(500).json({ message: 'NEWS_API_KEY not configured on server.' })

  const newsPath = req.path.replace('/api/news', '')
  const query    = new URLSearchParams(req.query)
  query.set('apiKey', API_KEY)

  try {
    const { data } = await axios.get(
      `https://newsapi.org/v2${newsPath}?${query.toString()}`,
      { timeout: 12000 }
    )
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message
    })
  }
})

// ── GEMINI AI PROXY ───────────────────────────────────────────────────────────
app.post('/api/ai/gemini', async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY
  if (!API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not set. Go to Render → Environment and add GEMINI_API_KEY. Get a free key at https://aistudio.google.com/apikey'
    })
  }

  const { systemPrompt, userPrompt, maxTokens = 1000 } = req.body

  if (!userPrompt) {
    return res.status(400).json({ error: 'userPrompt is required' })
  }

  const geminiBody = {
    contents: [{
      role: 'user',
      parts: [{ text: userPrompt }]
    }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3,
    }
  }

  // Add system instruction if provided
  if (systemPrompt) {
    geminiBody.systemInstruction = {
      parts: [{ text: systemPrompt }]
    }
  }

  try {
    // Try gemini-1.5-flash first (most reliable free model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
    
    const { data } = await axios.post(url, geminiBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    })

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    if (!text) {
      // Check for safety blocks
      const reason = data?.candidates?.[0]?.finishReason
      if (reason === 'SAFETY') {
        return res.status(200).json({ text: 'Content was filtered for safety. Please try a different query.' })
      }
      return res.status(200).json({ text: 'No response generated. Please try again.' })
    }

    res.json({ text })

  } catch (err) {
    const status  = err.response?.status || 500
    const message = err.response?.data?.error?.message || err.message || 'Gemini API error'
    
    console.error('Gemini error:', status, message)
    res.status(status).json({ error: message })
  }
})

// ── SERVE REACT BUILD ─────────────────────────────────────────────────────────
const buildPath = path.join(__dirname, '..', 'build')
app.use(express.static(buildPath))
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')))

app.listen(PORT, () => {
  console.log(`🚨 PANIC BUTTON running on port ${PORT}`)
  console.log(`   NEWS_API_KEY:   ${process.env.NEWS_API_KEY   ? 'SET ✅' : 'MISSING ❌'}`)
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET ✅' : 'MISSING ❌'}`)
})
