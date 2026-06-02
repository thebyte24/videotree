import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/videotreetransparent.png'
import { apiGetConfig } from '../api/client'
import './Hero.css'

const categories = [
  { name: 'Weddings',    slug: 'weddings' },
  { name: 'Engagement',  slug: 'engagement' },
  { name: 'Haldi',       slug: 'haldi' },
  { name: 'Pre-Wedding', slug: 'pre-wedding' },
  { name: 'Half Saree',  slug: 'half-saree' },
  { name: 'Baby Shoots', slug: 'baby-shoots' },
  { name: 'Ceremonies',  slug: 'ceremonies' },
  { name: 'Birthdays',   slug: 'birthdays' },
]

const FALLBACK_SLIDES = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=90' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=90' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1800&q=90' },
]

// Detect if a URL is a video
function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

// Normalise raw URL strings (from admin) into slide objects
function normaliseSlides(raw) {
  return raw.map((item) => {
    if (typeof item === 'string') {
      return { type: isVideo(item) ? 'video' : 'image', url: item }
    }
    return item
  })
}

// ── Video slide component ────────────────────────────────────────────────────
function VideoSlide({ url, active }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    if (active) {
      ref.current.currentTime = 0
      ref.current.play().catch(() => {})
    } else {
      ref.current.pause()
    }
  }, [active])

  return (
    <video
      ref={ref}
      className="carousel__video"
      src={url}
      muted
      loop
      playsInline
      preload="auto"
    />
  )
}

export default function Hero() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const navigate = useNavigate()
  const dragStart = useRef(null)

  useEffect(() => {
    apiGetConfig('heroSlides')
      .then((d) => {
        if (d?.value?.length) setSlides(normaliseSlides(d.value))
      })
      .catch(() => {})
  }, [])

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length])

  // Auto-advance — use longer duration for video slides
  useEffect(() => {
    if (paused) return
    const slide = slides[current]
    const duration = slide?.type === 'video' ? 12000 : 5500
    const t = setTimeout(next, duration)
    return () => clearTimeout(t)
  }, [paused, next, current, slides])

  const slide = slides[current]

  // Swipe / drag handlers (touch + mouse)
  const SWIPE_THRESHOLD = 50

  const handleDragStart = (clientX) => { dragStart.current = clientX }
  const handleDragEnd   = (clientX) => {
    if (dragStart.current === null) return
    const delta = dragStart.current - clientX
    if (Math.abs(delta) > SWIPE_THRESHOLD) delta > 0 ? next() : prev()
    dragStart.current = null
  }

  return (
    <section
      id="home"
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e)   => handleDragEnd(e.changedTouches[0].clientX)}
      onMouseDown={(e)  => handleDragStart(e.clientX)}
      onMouseUp={(e)    => handleDragEnd(e.clientX)}
    >
      {/* Full-screen crossfade slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="carousel__slide"
          style={slide?.type === 'image' ? { backgroundImage: `url(${slide.url})` } : {}}
          initial={{ opacity: 0, scale: slide?.type === 'video' ? 1 : 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {slide?.type === 'video' && (
            <VideoSlide url={slide.url} active={true} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* DESKTOP: category list on the left */}
      <motion.div
        className="hero__left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <ul className="category-list">
          {categories.map((c) => (
            <li
              key={c.slug}
              className="category-item"
              onClick={() => navigate(`/galleries/${c.slug}`)}
            >
              <span className="cat-name">{c.name}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* MOBILE: logo centered top + tagline */}
      <motion.div
        className="hero__mobile-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
      >
        <img src={logoImg} alt="Video Tree" className="hero__mobile-logo" />
        <p className="hero__mobile-tag">Crafting Stories, Frame by Frame</p>
      </motion.div>

      {/* MOBILE: category pills at bottom */}
      <motion.div
        className="hero__mobile-cats"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
      >
        {categories.map((c) => (
          <button
            key={c.slug}
            className="hero__mobile-pill"
            onClick={() => navigate(`/galleries/${c.slug}`)}
          >
            {c.name}
          </button>
        ))}
      </motion.div>

      {/* Prev / Next */}
      <button className="carousel__btn carousel__btn--prev" onClick={prev} aria-label="Previous">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="carousel__btn carousel__btn--next" onClick={next} aria-label="Next">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Dots — show video icon for video slides */}
      <div className="carousel__dots">
        {slides.map((s, i) => (
          <button
            key={i}
            className={`carousel__dot ${i === current ? 'active' : ''} ${s.type === 'video' ? 'carousel__dot--video' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          >
            {s.type === 'video' && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
