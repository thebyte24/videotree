import { useEffect } from 'react'

/**
 * SEO component — updates document title and meta tags per page.
 * Usage: <SEO title="..." description="..." canonical="..." />
 */
export default function SEO({ title, description, canonical, keywords, ogImage }) {
  const BASE_URL = 'https://videotree.co.in'
  const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`
  const fullTitle = title
    ? `${title} | Video Tree Visakhapatnam`
    : 'Video Tree — Wedding Photography & Videography in Visakhapatnam'
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  useEffect(() => {
    // Title
    document.title = fullTitle

    // Helper to set meta tag
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [attrName, attrVal] = attr.split('=')
        el.setAttribute(attrName, attrVal.replace(/"/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    if (description) {
      setMeta('meta[name="description"]', 'name=description', description)
      setMeta('meta[property="og:description"]', 'property=og:description', description)
      setMeta('meta[name="twitter:description"]', 'name=twitter:description', description)
    }
    if (keywords) setMeta('meta[name="keywords"]', 'name=keywords', keywords)

    setMeta('meta[property="og:title"]', 'property=og:title', fullTitle)
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', fullTitle)
    setMeta('meta[property="og:url"]', 'property=og:url', fullCanonical)

    if (ogImage) {
      setMeta('meta[property="og:image"]', 'property=og:image', ogImage)
      setMeta('meta[name="twitter:image"]', 'name=twitter:image', ogImage)
    }

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.setAttribute('href', fullCanonical)
  }, [fullTitle, description, keywords, fullCanonical, ogImage])

  return null
}
