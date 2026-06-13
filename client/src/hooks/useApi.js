import { useState, useEffect } from 'react'

/**
 * Generic data-fetching hook.
 * Usage: const { data, loading, error } = useApi(fetchFn, [deps])
 */
export function useApi(fetchFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchFn()
      .then((result) => { if (!cancelled) { setData(result); setLoading(false) } })
      .catch((err)   => { if (!cancelled) { setError(err.message); setLoading(false) } })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
