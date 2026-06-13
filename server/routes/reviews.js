const express      = require('express')
const router       = express.Router()
const { pool }     = require('../db')
const requireAdmin = require('../middleware/auth')

// GET /api/reviews
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM reviews ORDER BY `order` ASC, createdAt DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/reviews
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, rating = 5, text, order = 0 } = req.body
    const [result] = await pool.execute(
      'INSERT INTO reviews (name, rating, text, `order`) VALUES (?, ?, ?, ?)',
      [name, rating, text, order]
    )
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/reviews/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, rating = 5, text, order = 0 } = req.body
    await pool.execute(
      'UPDATE reviews SET name=?, rating=?, text=?, `order`=? WHERE id=?',
      [name, rating, text, order, req.params.id]
    )
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Review not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/reviews/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM reviews WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
