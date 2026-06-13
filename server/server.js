require('dotenv').config()
const express  = require('express')
const cors     = require('cors')
const path     = require('path')
const { initDB } = require('./db')

const app = express()

// Trust the reverse proxy (GoDaddy PAAS uses nginx in front)
app.set('trust proxy', 1)

app.use(cors({
  origin: '*',
  credentials: false,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files — cache for 7 days
app.use('/uploads', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=604800, immutable')
  next()
}, express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth',      require('./routes/auth'))
app.use('/api/upload',    require('./routes/upload'))
app.use('/api/galleries', require('./routes/galleries'))
app.use('/api/events',    require('./routes/events'))
app.use('/api/config',    require('./routes/config'))
app.use('/api/reviews',   require('./routes/reviews'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.get('/api/version', (_req, res) => res.json({ version: '2026-06-02-test' }))

// Temporary: reset corrupted config values
app.get('/api/fix-config', async (_req, res) => {
  try {
    const { pool } = require('./db')
    await pool.execute(`DELETE FROM site_config WHERE \`key\` IN ('heroSlides', 'galleryStrip')`)
    await pool.execute(`INSERT INTO site_config (\`key\`, value) VALUES ('heroSlides', '[]'), ('galleryStrip', '[]')`)
    res.json({ ok: true, message: 'Config reset to empty arrays' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Seed default gallery categories and events if missing
app.get('/api/seed', async (_req, res) => {
  try {
    const { pool } = require('./db')

    const categories = [
      ['weddings',    'WEDDINGS',    'Timeless moments from beautiful wedding celebrations.', 0],
      ['engagement',  'ENGAGEMENT',  'Beautiful engagement moments filled with love and joy.', 1],
      ['haldi',       'HALDI',       'Vibrant and colourful haldi ceremonies captured beautifully.', 2],
      ['pre-wedding', 'PRE-WEDDING', 'Romantic pre-wedding stories told through stunning frames.', 3],
      ['half-saree',  'HALF SAREE',  'Elegant half saree ceremonies marking a special milestone.', 4],
      ['baby-shoots', 'BABY SHOOTS', 'Adorable baby moments captured with warmth and care.', 5],
      ['ceremonies',  'CEREMONIES',  'Sacred rituals and cultural ceremonies captured with care.', 6],
      ['birthdays',   'BIRTHDAYS',   'Joyful birthday celebrations filled with colour and laughter.', 7],
    ]

    for (const [slug, label, description, order] of categories) {
      await pool.execute(
        `INSERT IGNORE INTO gallery_categories (slug, label, description, coverImage, photos, \`order\`) VALUES (?,?,?,?,?,?)`,
        [slug, label, description, '', '[]', order]
      )
    }

    const events = [
      {
        slug: 'phaniraj-akhila-wedding-visakhapatnam',
        couple: 'Phaniraj & Akhila',
        location: 'Visakhapatnam, Andhra',
        date: 'March, 2024',
        tagline: "Phaniraj and Akhila's wedding in Visakhapatnam",
        sections: [{ title: 'Haldi & Mehandi', photos: [] }, { title: 'Sangeeth', photos: [] }, { title: 'Wedding', photos: [] }],
        order: 0,
      },
      {
        slug: 'venu-himaja-wedding-hyderabad',
        couple: 'Venu & Himaja',
        location: 'Hyderabad, Telangana',
        date: 'January, 2024',
        tagline: "Venu and Himaja's grand wedding in Hyderabad",
        sections: [{ title: 'Pre-Wedding', photos: [] }, { title: 'Sangeeth', photos: [] }, { title: 'Wedding', photos: [] }],
        order: 1,
      },
    ]

    for (const e of events) {
      await pool.execute(
        `INSERT IGNORE INTO events (slug, couple, location, date, tagline, story, coverImage, sections, \`order\`) VALUES (?,?,?,?,?,?,?,?,?)`,
        [e.slug, e.couple, e.location, e.date, e.tagline, '[]', '', JSON.stringify(e.sections), e.order]
      )
    }

    res.json({ ok: true, message: 'Seeded gallery categories and events' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Serve React frontend static files — cache hashed assets for 1 year
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientBuildPath, {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    // Don't cache index.html — always fetch fresh so new deploys apply instantly
    if (filePath.endsWith('index.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    }
  }
}))

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('✗ MySQL connection failed:', err.message)
    process.exit(1)
  })
