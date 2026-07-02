require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')
const { initDB } = require('./db')

const app = express()

// Trust the reverse proxy (GoDaddy PAAS uses nginx in front)
// This makes req.protocol and req.hostname reflect the real public values
app.set('trust proxy', 1)

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files — cache for 7 days
app.use('/uploads', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=604800, immutable')
  next()
}, express.static(path.join(__dirname, 'uploads')))

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/upload',    require('./routes/upload'))
app.use('/api/galleries', require('./routes/galleries'))
app.use('/api/events',    require('./routes/events'))
app.use('/api/config',    require('./routes/config'))
app.use('/api/reviews',   require('./routes/reviews'))

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.get('/api/version', (_req, res) => res.json({ version: '2026-07-01' }))

// One-time URL fixer — run once to fix old broken image URLs in DB
// Remove this route after running it once
app.get('/api/fix-image-urls', async (_req, res) => {
  try {
    const fixScript = require('./fix-image-urls')
    res.json({ ok: true, message: 'URL fix triggered — check server logs' })
  } catch (e) {
    // Run inline if require doesn't work
    const { pool } = require('./db')
    const CORRECT_BASE = (process.env.PUBLIC_URL || 'https://videotree.co.in').replace(/\/$/, '')

    function fixUrl(url) {
      if (!url || !url.includes('/uploads/')) return url
      return `${CORRECT_BASE}/uploads/${url.split('/uploads/').pop()}`
    }
    function fixArr(arr) {
      return (arr || []).map(item => {
        if (typeof item === 'string') return fixUrl(item)
        if (item && item.url) return { ...item, url: fixUrl(item.url) }
        return item
      })
    }

    let fixed = 0
    const [cats] = await pool.execute('SELECT id, slug, coverImage, photos FROM gallery_categories')
    for (const c of cats) {
      const photos = typeof c.photos === 'string' ? JSON.parse(c.photos) : (c.photos || [])
      await pool.execute('UPDATE gallery_categories SET coverImage=?, photos=? WHERE id=?',
        [fixUrl(c.coverImage), JSON.stringify(fixArr(photos)), c.id])
      fixed++
    }
    const [evs] = await pool.execute('SELECT id, slug, coverImage, sections FROM events')
    for (const ev of evs) {
      const sections = typeof ev.sections === 'string' ? JSON.parse(ev.sections) : (ev.sections || [])
      const newSections = sections.map(s => ({ ...s, photos: fixArr(s.photos || []) }))
      await pool.execute('UPDATE events SET coverImage=?, sections=? WHERE id=?',
        [fixUrl(ev.coverImage), JSON.stringify(newSections), ev.id])
      fixed++
    }
    const [cfgs] = await pool.execute('SELECT id, `key`, value FROM site_config')
    for (const cfg of cfgs) {
      const val = typeof cfg.value === 'string' ? JSON.parse(cfg.value) : cfg.value
      const newVal = Array.isArray(val) ? fixArr(val) : val
      await pool.execute('UPDATE site_config SET value=? WHERE id=?',
        [JSON.stringify(newVal), cfg.id])
      fixed++
    }
    res.json({ ok: true, fixed, base: CORRECT_BASE })
  }
})

// ── Serve React frontend ─────────────────────────────────────────────────────
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientBuildPath, {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    // Never cache index.html so new deploys apply instantly
    if (filePath.endsWith('index.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    }
  }
}))

// SPA fallback — all non-API, non-upload routes serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

// ── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ── Init MySQL tables & start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

// Warn loudly if PUBLIC_URL isn't set — uploaded image URLs will be wrong
if (!process.env.PUBLIC_URL) {
  console.warn('⚠️  PUBLIC_URL is not set. Uploaded image URLs may not be publicly accessible.')
  console.warn('   Set PUBLIC_URL=https://videotree.co.in in your environment variables.')
}

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('✗ MySQL init failed:', err.message)
    process.exit(1)
  })
