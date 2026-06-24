const express         = require('express')
const router          = require('express').Router()
const { pool }        = require('../db')
const requireAdmin    = require('../middleware/auth')
const { cacheMiddleware, del: cacheDelete } = require('../cache')

const parseJ = (v, fallback = []) => {
  if (v === null || v === undefined) return fallback
  if (typeof v !== 'string') return v
  try { return JSON.parse(v) } catch { return fallback }
}

// Ensure youtubeUrl column exists — runs once on first PUT, no-ops after
async function ensureYoutubeCol() {
  try {
    await pool.execute(`ALTER TABLE gallery_categories ADD COLUMN youtubeUrl VARCHAR(500) DEFAULT ''`)
  } catch (e) {
    // Column already exists — ignore duplicate column error
    if (!e.message.includes('Duplicate column')) throw e
  }
}
let ytColEnsured = false

// GET /api/galleries
router.get('/', cacheMiddleware(120), async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM gallery_categories ORDER BY `order` ASC, createdAt ASC')
    const cats = rows.map(r => ({ ...r, photos: parseJ(r.photos) }))
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json(cats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/galleries/:slug
router.get('/:slug', cacheMiddleware(120), async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM gallery_categories WHERE slug = ?', [req.params.slug])
    if (!rows.length) return res.status(404).json({ error: 'Category not found' })
    const r = rows[0]
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json({ ...r, photos: parseJ(r.photos) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/galleries/:slug
router.put('/:slug', requireAdmin, async (req, res) => {
  if (!ytColEnsured) { await ensureYoutubeCol(); ytColEnsured = true }
  try {
    const { label, description='', coverImage='', photos=[], order=0, youtubeUrl='' } = req.body
    await pool.execute(
      `INSERT INTO gallery_categories (slug, label, description, coverImage, photos, \`order\`, youtubeUrl)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         label=VALUES(label), description=VALUES(description),
         coverImage=VALUES(coverImage), photos=VALUES(photos), \`order\`=VALUES(\`order\`),
         youtubeUrl=VALUES(youtubeUrl)`,
      [req.params.slug, label, description, coverImage, JSON.stringify(photos), order, youtubeUrl]
    )
    // Invalidate cache for this category and the full list
    cacheDelete(`http:/api/galleries`)
    const [rows] = await pool.execute('SELECT * FROM gallery_categories WHERE slug = ?', [req.params.slug])
    const r = rows[0]
    res.json({ ...r, photos: parseJ(r.photos) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
