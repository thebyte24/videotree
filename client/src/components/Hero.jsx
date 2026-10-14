import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { apiGetConfig } from '../api/client'
import { useApi } from '../hooks/useApi'
import './Hero.css'

// Stable fetch function — defined outside component so reference never changes
function fetchHeroSlides() { return apiGetConfig('heroSlides') }

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

// Detect if a URL is a video
function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

// Normalise raw URL strings (from admin) into slide objects
function normaliseSlides(raw) {
  return raw.map((item) => {
    if (typeof item === 'string') {
      return { type: isVideo(item) ? 'video' : 'image', url: item, x: 50, y: 50 }
    }
    const url = typeof item.url === 'string' ? item.url : ''
    return {
      type: item.type || (isVideo(url) ? 'video' : 'image'),
      url,
      x: item.x ?? 50,
      y: item.y ?? 50,
    }
  })
}

// ── Video slide component ────────────────────────────────────────────────────
function VideoSlide({ url, active }) {
  const ref = useRef(null)
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (active) {
      ref.current.currentTime = 0
      ref.current.play().catch(() => {})
    } else {
      ref.current.pause()
    }
  }, [active])

  function handleLoadedMetadata() {
    if (!ref.current) return
    const { videoWidth, videoHeight } = ref.current
    setIsPortrait(videoHeight > videoWidth)
  }

  return (
    <video
      ref={ref}
      className={`carousel__video${isPortrait ? ' carousel__video--portrait' : ''}`}
      src={url}
      muted
      loop
      playsInline
      preload="auto"
      onLoadedMetadata={handleLoadedMetadata}
    />
  )
}

export default function Hero() {
  // Use cached useApi so repeat visits are instant
  const { data: configData } = useApi(fetchHeroSlides)
  const rawSlides = configData?.value?.length ? normaliseSlides(configData.value) : []

  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [prevSlidesLength, setPrevSlidesLength] = useState(rawSlides.length)
  const navigate = useNavigate()
  const dragStart = useRef(null)

  if (rawSlides.length !== prevSlidesLength) {
    setPrevSlidesLength(rawSlides.length)
    setCurrent(0)
  }

  const slides = rawSlides
  const total  = slides.length

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])

  // Auto-advance
  useEffect(() => {
    if (paused || total === 0) return
    const slide = slides[current]
    const duration = slide?.type === 'video' ? 12000 : 5500
    const t = setTimeout(next, duration)
    return () => clearTimeout(t)
  }, [paused, next, current, slides, total])

  // Preload next image slide so transition is instant
  useEffect(() => {
    if (total === 0) return
    const nextSlide = slides[(current + 1) % total]
    if (nextSlide?.type === 'image' && nextSlide.url) {
      const img = new Image()
      img.src = nextSlide.url
    }
  }, [current, slides, total])

  const slide = slides[current]

  const SWIPE_THRESHOLD = 50
  const handleDragStart = (clientX) => { dragStart.current = clientX }
  const handleDragEnd   = (clientX) => {
    if (dragStart.current === null) return
    const delta = dragStart.current - clientX
    if (Math.abs(delta) > SWIPE_THRESHOLD) delta > 0 ? next() : prev()
    dragStart.current = null
  }

  // No slides configured yet — render a plain dark hero so layout doesn't break
  if (total === 0) {
    return (
      <section id="home" className="hero">
        <div className="carousel__stage carousel__stage--empty" />
        <div className="hero__mobile-cats">
          {categories.map((c) => (
            <button key={c.slug} className="hero__mobile-pill" onClick={() => navigate(`/galleries/${c.slug}`)}>
              {c.name}
            </button>
          ))}
        </div>
      </section>
    )
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
      <div className="carousel__stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="carousel__slide"
            initial={{ opacity: 0, scale: slide?.type === 'video' ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {slide?.type === 'video' ? (
              <VideoSlide url={slide.url} active={true} />
            ) : (
              /* Use <img> instead of backgroundImage so browser can prioritise + preload */
              <img
                src={slide.url}
                alt=""
                className="carousel__img"
                fetchpriority={current === 0 ? 'high' : 'auto'}
                loading={current === 0 ? 'eager' : 'lazy'}
                style={{ objectPosition: `${slide.x ?? 50}% ${slide.y ?? 50}%` }}
                draggable={false}
              />
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
              <li key={c.slug} className="category-item" onClick={() => navigate(`/galleries/${c.slug}`)}>
                <span className="cat-name">{c.name}</span>
              </li>
            ))}
          </ul>
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
      </div>

      {/* MOBILE: category pills */}
      <div className="hero__mobile-cats">
        {categories.map((c) => (
          <button key={c.slug} className="hero__mobile-pill" onClick={() => navigate(`/galleries/${c.slug}`)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Dots */}
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
