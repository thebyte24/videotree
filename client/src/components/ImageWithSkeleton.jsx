import { useState } from 'react'
import './ImageWithSkeleton.css'

/**
 * Drop-in replacement for <img> that shows a shimmer skeleton
 * while the image loads, and a fallback icon if it errors.
 *
 * Props: all standard <img> props are forwarded.
 */
export default function ImageWithSkeleton({ src, alt, className = '', style = {}, loading: loadingAttr = 'lazy', ...rest }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'loaded' | 'error'

  return (
    <div className={`img-skeleton-wrap ${className}`} style={style}>
      {status === 'loading' && (
        <div className="img-skeleton__shimmer" aria-hidden="true" />
      )}
      {status === 'error' && (
        <div className="img-skeleton__error" aria-label="Image unavailable">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Image unavailable</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={loadingAttr}
        className={`img-skeleton__img ${status === 'loaded' ? 'img-skeleton__img--visible' : ''}`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        {...rest}
      />
    </div>
  )
}
