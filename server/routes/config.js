const express      = require('express')
const router       = express.Router()
const SiteConfig   = require('../models/SiteConfig')
const requireAdmin = require('../middleware/auth')

// GET /api/config/:key — get a config value (public)
router.get('/:key', async (req, res) => {
  try {
    const doc = await SiteConfig.findOne({ key: req.params.key })
    if (!doc) return res.status(404).json({ error: 'Config not found' })
    res.json({ key: doc.key, value: doc.value })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/config/:key — set a config value (admin)
router.put('/:key', requireAdmin, async (req, res) => {
  try {
    const doc = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { $set: { value: req.body.value } },
      { new: true, upsert: true }
    )
    res.json({ key: doc.key, value: doc.value })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
