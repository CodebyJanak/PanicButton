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
app.use(express.json())

// ── NEWSAPI PROXY ─────────────────────────────────────────────────────────────
app.get('/api/news/*', async (req, res) => {
  const API_KEY = process.env.NEWS_API_KEY
  if (!API_KEY) return res.status(500).json({ message: 'NEWS_API_KEY not configured.' })

  const newsPath = req.path.replace('/api/news', '')
  const query    = new URLSearchParams(req.query)
  query.set('apiKey', API_KEY)

  try {
    const { data } = await axios.get(`https://newsapi.org/v2${newsPath}?${query}`, { timeout: 12000 })
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || err.message })
  }
})

// ── GEMINI AI PROXY (FREE) ────────────────────────────────────────────────────
// Uses Google Gemini 1.5 Flash — completely free, 15 RPM, 1M tokens/day
app.post('/api/ai/gemini', async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY
  if (!API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server.' })

  const { systemPrompt, userPrompt, maxTokens = 1000 } = req.body

  // Build Gemini API request
  const geminiBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: systemPrompt ? {
      parts: [{ text: systemPrompt }]
    } : undefined,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3,
    }
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
    const { data } = await axios.post(url, geminiBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    })

    // Extract text from Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    res.json({ text })
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message
    res.status(err.response?.status || 500).json({ error: msg })
  }
})

// ── SERVE REACT BUILD ─────────────────────────────────────────────────────────
const buildPath = path.join(__dirname, '..', 'build')
app.use(express.static(buildPath))
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')))

app.listen(PORT, () => console.log(`🚨 PANIC BUTTON on port ${PORT}`))
