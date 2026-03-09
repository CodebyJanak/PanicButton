import express from 'express'
import axios from 'axios'
import cors from 'cors'
import path from 'path'
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
  if (!API_KEY) return res.status(500).json({ message: 'NEWS_API_KEY not configured on server.' })

  const newsPath = req.path.replace('/api/news', '')
  const query    = new URLSearchParams(req.query)
  query.set('apiKey', API_KEY)
  const url = `https://newsapi.org/v2${newsPath}?${query.toString()}`

  try {
    const { data } = await axios.get(url, { timeout: 12000 })
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || err.message })
  }
})

// ── ANTHROPIC AI PROXY ────────────────────────────────────────────────────────
// Browser can't call api.anthropic.com directly (CORS blocked)
// All AI calls go through here server-side
app.post('/api/ai/messages', async (req, res) => {
  const API_KEY = process.env.ANTHROPIC_API_KEY
  if (!API_KEY) return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY not configured on server.' } })

  try {
    const { data } = await axios.post(
      'https://api.anthropic.com/v1/messages',
      req.body,
      {
        headers: {
          'Content-Type':         'application/json',
          'x-api-key':            API_KEY,
          'anthropic-version':    '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        timeout: 30000,
      }
    )
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: { message: err.message } })
  }
})

// ── SERVE REACT BUILD ─────────────────────────────────────────────────────────
const buildPath = path.join(__dirname, '..', 'build')
app.use(express.static(buildPath))
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')))

app.listen(PORT, () => console.log(`🚨 PANIC BUTTON on port ${PORT}`))
