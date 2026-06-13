const express      = require('express')
const router       = express.Router()
const { pool }     = require('../db')
const requireAdmin = require('../middleware/auth')

// GET /api/config/:key
router.get('/:key', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_config WHERE `key` = ?', [req.params.key])
    if (!rows.length) return res.status(404).json({ error: 'Config not found' })
    const r = rows[0]
    // mysql2 auto-parses JSON columns — avoid double JSON.parse
    const value = typeof r.value === 'string' ? JSON.parse(r.value) : r.value
    res.json({ key: r.key, value })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/config/:key
router.put('/:key', requireAdmin, async (req, res) => {
  try {
    await pool.execute(
      `INSERT INTO site_config (\`key\`, value) VALUES (?,?)
       ON DUPLICATE KEY UPDATE value=VALUES(value)`,
      [req.params.key, JSON.stringify(req.body.value)]
    )
    const [rows] = await pool.execute('SELECT * FROM site_config WHERE `key` = ?', [req.params.key])
    const r = rows[0]
    const value = typeof r.value === 'string' ? JSON.parse(r.value) : r.value
    res.json({ key: r.key, value })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
