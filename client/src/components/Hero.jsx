import { useState, useEffect, useCallback } from 'react'
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
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=90',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=90',
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1800&q=90',
]

export default function Hero() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    apiGetConfig('heroSlides')
      .then((d) => { if (d?.value?.length) setSlides(d.value) })
      .catch(() => {})
  }, [])

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5500)
    return () => clearInterval(t)
  }, [paused, next])

  return (
    <section
      id="home"
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-screen crossfade slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="carousel__slide"
          style={{ backgroundImage: `url(${slides[current]})` }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
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

      {/* Prev / Next — desktop only */}
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

      {/* Dots */}
      <div className="carousel__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel__dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
