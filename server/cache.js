/**
 * Lightweight in-process cache with TTL.
 * O(1) get/set — Map backed.
 * For a single-process Node app this is equivalent to Redis for read-heavy,
 * rarely-mutated data like gallery categories and site config.
 *
 * To swap for Redis later: replace get/set/del with ioredis calls.
 */

const store = new Map()

/**
 * Get a cached value. Returns null if missing or expired.
 * @param {string} key
 * @returns {any|null}
 */
function get(key) {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.exp) { store.delete(key); return null }
  return entry.val
}

/**
 * Set a cached value with a TTL in seconds (default 60s).
 * @param {string} key
 * @param {any} val
 * @param {number} ttl  seconds
 */
function set(key, val, ttl = 60) {
  store.set(key, { val, exp: Date.now() + ttl * 1000 })
}

/**
 * Delete one or more keys by exact match or prefix.
 * @param {string} keyOrPrefix
 */
function del(keyOrPrefix) {
  for (const k of store.keys()) {
    if (k === keyOrPrefix || k.startsWith(keyOrPrefix)) store.delete(k)
  }
}

/**
 * Express middleware factory — caches GET responses by URL.
 * Usage: router.get('/', cacheMiddleware(120), handler)
 * @param {number} ttl  seconds
 */
function cacheMiddleware(ttl = 60) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next()
    const key = `http:${req.originalUrl}`
    const hit = get(key)
    if (hit) {
      res.set('X-Cache', 'HIT')
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
      return res.json(hit)
    }
    // Intercept res.json to store result
    const origJson = res.json.bind(res)
    res.json = (body) => {
      if (res.statusCode === 200) set(key, body, ttl)
      res.set('X-Cache', 'MISS')
      return origJson(body)
    }
    next()
  }
}

module.exports = { get, set, del, cacheMiddleware }
