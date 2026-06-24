import { useState, useEffect, useRef } from 'react'

/**
 * Simple in-memory cache — survives re-renders and page navigation within the session.
 * Key → { data, ts } — entries expire after TTL_MS.
 */
const cache = new Map()
const TTL_MS = 60_000 // 1 minute

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > TTL_MS) { cache.delete(key); return null }
  return entry.data
}

function setCached(key, data) {
  cache.set(key, { data, ts: Date.now() })
}

/** Invalidate a cache entry by key prefix — call after mutations */
export function invalidateCache(keyPrefix) {
  for (const k of cache.keys()) {
    if (k.startsWith(keyPrefix)) cache.delete(k)
  }
}

/**
 * Generic data-fetching hook with in-memory caching.
 * Usage: const { data, loading, error } = useApi(fetchFn, [deps])
 * The cache key is derived from the function name + serialised deps.
 */
export function useApi(fetchFn, deps = []) {
  const cacheKey = `${fetchFn.name}:${JSON.stringify(deps)}`
  const cached   = getCached(cacheKey)

  const [data,    setData]    = useState(cached)
  const [loading, setLoading] = useState(!cached)
  const [error,   setError]   = useState(null)

  // Keep a stable ref so the effect doesn't re-run when fetchFn identity changes
  const fnRef = useRef(fetchFn)
  fnRef.current = fetchFn

  useEffect(() => {
    const hit = getCached(cacheKey)
    if (hit) { setData(hit); setLoading(false); return }

    let cancelled = false
    setLoading(true)
    setError(null)

    fnRef.current()
      .then((result) => {
        if (!cancelled) {
          setCached(cacheKey, result)
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
