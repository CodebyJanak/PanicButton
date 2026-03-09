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

app.get('/api/news/*', async (req, res) => {
  const API_KEY = process.env.NEWS_API_KEY
  if (!API_KEY) return res.status(500).json({ message: 'NEWS_API_KEY not set on server.' })

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

const buildPath = path.join(__dirname, '..', 'build')
app.use(express.static(buildPath))
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')))

app.listen(PORT, () => console.log(`🚨 PANIC BUTTON on port ${PORT}`))
