const express      = require('express')
const router       = express.Router()
const { pool }     = require('../db')
const requireAdmin = require('../middleware/auth')

// GET /api/events
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events ORDER BY `order` ASC, createdAt DESC')
    const events = rows.map(r => ({
      ...r,
      story:    JSON.parse(r.story    || '[]'),
      sections: JSON.parse(r.sections || '[]'),
    }))
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/events/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events WHERE slug = ?', [req.params.slug])
    if (!rows.length) return res.status(404).json({ error: 'Event not found' })
    const r = rows[0]
    res.json({
      ...r,
      story:    JSON.parse(r.story    || '[]'),
      sections: JSON.parse(r.sections || '[]'),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/events
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { slug, couple, location='', date='', tagline='', story=[], coverImage='', sections=[], order=0 } = req.body
    await pool.execute(
      'INSERT INTO events (slug, couple, location, date, tagline, story, coverImage, sections, `order`) VALUES (?,?,?,?,?,?,?,?,?)',
      [slug, couple, location, date, tagline, JSON.stringify(story), coverImage, JSON.stringify(sections), order]
    )
    const [rows] = await pool.execute('SELECT * FROM events WHERE slug = ?', [slug])
    const r = rows[0]
    res.status(201).json({ ...r, story: JSON.parse(r.story||'[]'), sections: JSON.parse(r.sections||'[]') })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/events/:slug
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const { couple, location='', date='', tagline='', story=[], coverImage='', sections=[], order=0 } = req.body
    await pool.execute(
      `INSERT INTO events (slug, couple, location, date, tagline, story, coverImage, sections, \`order\`)
       VALUES (?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         couple=VALUES(couple), location=VALUES(location), date=VALUES(date),
         tagline=VALUES(tagline), story=VALUES(story), coverImage=VALUES(coverImage),
         sections=VALUES(sections), \`order\`=VALUES(\`order\`)`,
      [req.params.slug, couple, location, date, tagline, JSON.stringify(story), coverImage, JSON.stringify(sections), order]
    )
    const [rows] = await pool.execute('SELECT * FROM events WHERE slug = ?', [req.params.slug])
    const r = rows[0]
    res.json({ ...r, story: JSON.parse(r.story||'[]'), sections: JSON.parse(r.sections||'[]') })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/events/:slug
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM events WHERE slug = ?', [req.params.slug])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
