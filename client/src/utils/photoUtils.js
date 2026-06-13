/**
 * Normalise a photo entry — can be a plain URL string or { url, x, y }
 * Returns { url, x, y } always.
 */
export function normalisePhoto(entry) {
  if (!entry) return { url: '', x: 50, y: 50 }
  if (typeof entry === 'string') return { url: entry, x: 50, y: 50 }
  return { url: entry.url || '', x: entry.x ?? 50, y: entry.y ?? 50 }
}

/** Get just the URL from a photo entry */
export function photoUrl(entry) {
  return normalisePhoto(entry).url
}

/** CSS object-position value from a photo entry */
export function photoPosition(entry) {
  const { x, y } = normalisePhoto(entry)
  return `${x}% ${y}%`
}
