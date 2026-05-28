const express      = require('express')
const router       = express.Router()
const Event        = require('../models/Event')
const requireAdmin = require('../middleware/auth')

// GET /api/events — all events (public)
router.get('/', async (_req, res) => {
  try {
    const events = await Event.find().sort({ order: 1, createdAt: -1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/events/:slug — single event (public)
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/events — create event (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/events/:slug — update event (admin)
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(event)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/events/:slug — delete event (admin)
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    await Event.findOneAndDelete({ slug: req.params.slug })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
