const express    = require('express')
const router     = express.Router()
const upload     = require('../middleware/upload')
const requireAdmin = require('../middleware/auth')

/**
 * POST /api/upload
 * Upload one or more images. Returns array of public URLs.
 * Protected — admin only.
 */
router.post('/', requireAdmin, upload.array('images', 50), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' })
  }

  const baseUrl = process.env.PUBLIC_URL || `https://${req.get('host')}`
  const urls = req.files.map(
    (f) => `${baseUrl}/uploads/${f.filename}`
  )

  res.json({ urls })
})

/**
 * DELETE /api/upload
 * Delete an uploaded file by filename.
 * Protected — admin only.
 */
const path = require('path')
const fs   = require('fs')

router.delete('/', requireAdmin, (req, res) => {
  const { filename } = req.body
  if (!filename) return res.status(400).json({ error: 'filename required' })

  // Prevent path traversal
  const safe = path.basename(filename)
  const filePath = path.join(__dirname, '..', 'uploads', safe)

  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: 'File not found' })
    res.json({ success: true })
  })
})

module.exports = router
