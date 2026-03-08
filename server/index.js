const express = require('express');
const axios   = require('axios');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── NEWSAPI PROXY ────────────────────────────────────────────────────────────
// All requests to /api/news/* get forwarded to newsapi.org server-side
app.get('/api/news/*', async (req, res) => {
  const API_KEY = process.env.NEWS_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ message: 'NEWS_API_KEY not set on server.' });
  }

  // Build the NewsAPI URL — strip /api/news prefix
  const newsPath = req.path.replace('/api/news', '');
  const query    = new URLSearchParams(req.query);
  query.set('apiKey', API_KEY); // inject key server-side

  const url = `https://newsapi.org/v2${newsPath}?${query.toString()}`;

  try {
    const response = await axios.get(url, { timeout: 12000 });
    res.json(response.data);
  } catch (err) {
    const status  = err.response?.status  || 500;
    const message = err.response?.data?.message || err.message || 'Proxy error';
    res.status(status).json({ message });
  }
});

// ── SERVE REACT BUILD ────────────────────────────────────────────────────────
// In production, serve the React app from the build folder
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// All other routes → React app (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚨 PANIC BUTTON server running on port ${PORT}`);
});
