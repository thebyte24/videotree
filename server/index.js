require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')
const { initDB } = require('./db')

const app = express()

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/upload',    require('./routes/upload'))
app.use('/api/galleries', require('./routes/galleries'))
app.use('/api/events',    require('./routes/events'))
app.use('/api/config',    require('./routes/config'))
app.use('/api/reviews',   require('./routes/reviews'))

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// ── Init MySQL tables & start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('✗ MySQL init failed:', err.message)
    process.exit(1)
  })
