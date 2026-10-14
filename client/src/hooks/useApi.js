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

  const [state, setState] = useState({
    data: cached,
    loading: !cached,
    error: null,
    cacheKey: cacheKey // Store cacheKey to detect changes during render
  })

  // Detect derived state changes directly during render instead of effect
  if (state.cacheKey !== cacheKey) {
    const newCached = getCached(cacheKey)
    setState({
      data: newCached,
      loading: !newCached,
      error: null,
      cacheKey: cacheKey
    })
  }

  // Keep a stable ref so the effect doesn't re-run when fetchFn identity changes
  const fnRef = useRef(fetchFn)

  useEffect(() => {
    fnRef.current = fetchFn
  }, [fetchFn])

  useEffect(() => {
    // Check if we just initialized state from cache during render
    const hit = getCached(cacheKey)
    if (hit) {
      return
    }

    let cancelled = false

    // We don't need to call setLoading(true) here because it is handled during the render phase

    fnRef.current()
      .then((result) => {
        if (!cancelled) {
          setCached(cacheKey, result)
          setState(prev => ({ ...prev, data: result, loading: false }))
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState(prev => ({ ...prev, error: err.message, loading: false }))
        }
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  // Use the latest derived state if cacheKey changed in this render, otherwise state
  const currentData = state.cacheKey !== cacheKey ? (getCached(cacheKey) || state.data) : state.data;
  const currentLoading = state.cacheKey !== cacheKey ? !getCached(cacheKey) : state.loading;
  const currentError = state.cacheKey !== cacheKey ? null : state.error;

  return { data: currentData, loading: currentLoading, error: currentError }
}
