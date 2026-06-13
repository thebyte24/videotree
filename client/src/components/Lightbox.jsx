import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photoUrl } from '../utils/photoUtils'
import './Lightbox.css'

export default function Lightbox({ photos, index, onClose, onNav }) {
  const dragStart = useRef(null)
  const total = photos.length

  const prev = useCallback(() => onNav((index - 1 + total) % total), [index, total, onNav])
  const next = useCallback(() => onNav((index + 1) % total), [index, total, onNav])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, next, prev])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const SWIPE = 60
  function onTouchStart(e) { dragStart.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (dragStart.current === null) return
    const delta = dragStart.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > SWIPE) delta > 0 ? next() : prev()
    dragStart.current = null
  }

  const url = photoUrl(photos[index])

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Close */}
        <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>

        {/* Counter */}
        <div className="lightbox__counter">{index + 1} / {total}</div>

        {/* Image */}
        <motion.img
          key={index}
          src={url}
          alt=""
          className="lightbox__img"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
        />

        {/* Prev / Next */}
        {total > 1 && (
          <>
            <button className="lightbox__btn lightbox__btn--prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="lightbox__btn lightbox__btn--next" onClick={e => { e.stopPropagation(); next() }} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
