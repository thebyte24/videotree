const express         = require('express')
const router          = express.Router()
const { pool }        = require('../db')
const requireAdmin    = require('../middleware/auth')

// GET /api/galleries
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM gallery_categories ORDER BY `order` ASC, createdAt ASC')
    const cats = rows.map(r => ({ ...r, photos: JSON.parse(r.photos || '[]') }))
    res.json(cats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/galleries/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM gallery_categories WHERE slug = ?', [req.params.slug])
    if (!rows.length) return res.status(404).json({ error: 'Category not found' })
    const r = rows[0]
    res.json({ ...r, photos: JSON.parse(r.photos || '[]') })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/galleries/:slug
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const { label, description='', coverImage='', photos=[], order=0 } = req.body
    await pool.execute(
      `INSERT INTO gallery_categories (slug, label, description, coverImage, photos, \`order\`)
       VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         label=VALUES(label), description=VALUES(description),
         coverImage=VALUES(coverImage), photos=VALUES(photos), \`order\`=VALUES(\`order\`)`,
      [req.params.slug, label, description, coverImage, JSON.stringify(photos), order]
    )
    const [rows] = await pool.execute('SELECT * FROM gallery_categories WHERE slug = ?', [req.params.slug])
    const r = rows[0]
    res.json({ ...r, photos: JSON.parse(r.photos || '[]') })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
