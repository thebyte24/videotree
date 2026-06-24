const express      = require('express')
const router       = require('express').Router()
const { pool }     = require('../db')
const requireAdmin = require('../middleware/auth')
const { cacheMiddleware, del: cacheDelete } = require('../cache')

const parseJ = (v, fallback = []) => {
  if (v === null || v === undefined) return fallback
  if (typeof v !== 'string') return v
  try { return JSON.parse(v) } catch { return fallback }
}

// Ensure youtubeUrl column exists — runs once on first PUT/POST, no-ops after
async function ensureYoutubeCol() {
  try {
    await pool.execute(`ALTER TABLE events ADD COLUMN youtubeUrl VARCHAR(500) DEFAULT ''`)
  } catch (e) {
    if (!e.message.includes('Duplicate column')) throw e
  }
}
let ytColEnsured = false

// GET /api/events
router.get('/', cacheMiddleware(120), async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events ORDER BY `order` ASC, createdAt DESC')
    const events = rows.map(r => ({ ...r, story: parseJ(r.story), sections: parseJ(r.sections) }))
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/events/:slug
router.get('/:slug', cacheMiddleware(120), async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events WHERE slug = ?', [req.params.slug])
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    const r = rows[0]
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json({ ...r, story: parseJ(r.story), sections: parseJ(r.sections) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/events
router.post('/', requireAdmin, async (req, res) => {
  if (!ytColEnsured) { await ensureYoutubeCol(); ytColEnsured = true }
  try {
    const { slug, couple, location='', date='', tagline='', story=[], coverImage='', sections=[], order=0, youtubeUrl='' } = req.body
    await pool.execute(
      'INSERT INTO events (slug, couple, location, date, tagline, story, coverImage, sections, `order`, youtubeUrl) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [slug, couple, location, date, tagline, JSON.stringify(story), coverImage, JSON.stringify(sections), order, youtubeUrl]
    )
    cacheDelete('http:/api/events')
    const [rows] = await pool.execute('SELECT * FROM events WHERE slug = ?', [slug])
    const r = rows[0]
    res.status(201).json({ ...r, story: parseJ(r.story), sections: parseJ(r.sections) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/events/:slug
router.put('/:slug', requireAdmin, async (req, res) => {
  if (!ytColEnsured) { await ensureYoutubeCol(); ytColEnsured = true }
  try {
    const { couple, location='', date='', tagline='', story=[], coverImage='', sections=[], order=0, youtubeUrl='' } = req.body
    await pool.execute(
      `INSERT INTO events (slug, couple, location, date, tagline, story, coverImage, sections, \`order\`, youtubeUrl)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         couple=VALUES(couple), location=VALUES(location), date=VALUES(date),
         tagline=VALUES(tagline), story=VALUES(story), coverImage=VALUES(coverImage),
         sections=VALUES(sections), \`order\`=VALUES(\`order\`), youtubeUrl=VALUES(youtubeUrl)`,
      [req.params.slug, couple, location, date, tagline, JSON.stringify(story), coverImage, JSON.stringify(sections), order, youtubeUrl]
    )
    cacheDelete('http:/api/events')
    const [rows] = await pool.execute('SELECT * FROM events WHERE slug = ?', [req.params.slug])
    const r = rows[0]
    res.json({ ...r, story: parseJ(r.story), sections: parseJ(r.sections) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/events/:slug
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM events WHERE slug = ?', [req.params.slug])
    cacheDelete('http:/api/events')
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
