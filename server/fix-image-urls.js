/**
 * fix-image-urls.js
 * 
 * Fixes all image URLs in the database that were saved with a wrong hostname.
 * Run this ONCE on the server after setting PUBLIC_URL correctly.
 * 
 * Usage:
 *   node fix-image-urls.js
 * 
 * It replaces any hostname in /uploads/ URLs with the correct PUBLIC_URL.
 * e.g. http://internal:5000/uploads/foo.jpg → https://videotree.co.in/uploads/foo.jpg
 */

require('dotenv').config()
const { pool } = require('./db')

const CORRECT_BASE = (process.env.PUBLIC_URL || 'https://videotree.co.in').replace(/\/$/, '')

// Normalise a single URL — if it contains /uploads/, rewrite the base
function fixUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('/uploads/')) return url
  const filename = url.split('/uploads/').pop()
  return `${CORRECT_BASE}/uploads/${filename}`
}

// Fix a JSON value that may be a string, array of strings/objects, or nested
function fixValue(val) {
  if (!val) return val
  if (typeof val === 'string') return fixUrl(val)
  if (Array.isArray(val)) {
    return val.map(item => {
      if (typeof item === 'string') return fixUrl(item)
      if (item && typeof item === 'object') {
        const out = { ...item }
        if (out.url) out.url = fixUrl(out.url)
        if (out.photos) out.photos = fixValue(out.photos)
        return out
      }
      return item
    })
  }
  if (typeof val === 'object') {
    const out = { ...val }
    if (out.url) out.url = fixUrl(out.url)
    return out
  }
  return val
}

async function run() {
  console.log(`\n🔧 Fixing image URLs → ${CORRECT_BASE}\n`)
  let total = 0

  // ── gallery_categories ───────────────────────────────────────────────────
  const [cats] = await pool.execute('SELECT id, slug, coverImage, photos FROM gallery_categories')
  for (const cat of cats) {
    const newCover  = fixUrl(cat.coverImage)
    const photos    = typeof cat.photos === 'string' ? JSON.parse(cat.photos) : cat.photos
    const newPhotos = fixValue(photos || [])
    await pool.execute(
      'UPDATE gallery_categories SET coverImage=?, photos=? WHERE id=?',
      [newCover, JSON.stringify(newPhotos), cat.id]
    )
    console.log(`  ✓ gallery: ${cat.slug}`)
    total++
  }

  // ── events ───────────────────────────────────────────────────────────────
  const [events] = await pool.execute('SELECT id, slug, coverImage, sections FROM events')
  for (const ev of events) {
    const newCover   = fixUrl(ev.coverImage)
    const sections   = typeof ev.sections === 'string' ? JSON.parse(ev.sections) : ev.sections
    const newSections = (sections || []).map(s => ({
      ...s,
      photos: fixValue(s.photos || [])
    }))
    await pool.execute(
      'UPDATE events SET coverImage=?, sections=? WHERE id=?',
      [newCover, JSON.stringify(newSections), ev.id]
    )
    console.log(`  ✓ event: ${ev.slug}`)
    total++
  }

  // ── site_config (heroSlides, galleryStrip) ────────────────────────────────
  const [configs] = await pool.execute("SELECT id, `key`, value FROM site_config")
  for (const cfg of configs) {
    const val    = typeof cfg.value === 'string' ? JSON.parse(cfg.value) : cfg.value
    const newVal = fixValue(val)
    await pool.execute(
      'UPDATE site_config SET value=? WHERE id=?',
      [JSON.stringify(newVal), cfg.id]
    )
    console.log(`  ✓ config: ${cfg.key}`)
    total++
  }

  console.log(`\n✅ Done — fixed ${total} records\n`)
  process.exit(0)
}

run().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
