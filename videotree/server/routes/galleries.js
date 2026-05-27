const express      = require('express')
const router       = express.Router()
const GalleryCategory = require('../models/GalleryCategory')
const requireAdmin = require('../middleware/auth')

// GET /api/galleries — all categories (public)
router.get('/', async (_req, res) => {
  try {
    const cats = await GalleryCategory.find().sort({ order: 1, createdAt: 1 })
    res.json(cats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/galleries/:slug — single category (public)
router.get('/:slug', async (req, res) => {
  try {
    const cat = await GalleryCategory.findOne({ slug: req.params.slug })
    if (!cat) return res.status(404).json({ error: 'Category not found' })
    res.json(cat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/galleries/:slug — update category (admin)
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const cat = await GalleryCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(cat)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
