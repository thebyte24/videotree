import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Hero.css'

const slides = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=90',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=90',
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1800&q=90',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1800&q=90',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=90',
]

const categories = [
  { num: '01', name: 'Weddings' },
  { num: '02', name: 'Shoots' },
  { num: '03', name: 'Ceremonies' },
  { num: '04', name: 'Birthdays' },
]

/* Split text into individual letter spans for staggered reveal */
function SplitText({ text, className, delay = 0 }) {
  const letters = Array.from(text)
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: delay } }
      }}
      aria-label={text}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
          variants={{
            hidden: { opacity: 0, y: 28, rotateX: -40 },
            show:   { opacity: 1, y: 0,  rotateX: 0,
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function Hero() {
  const [current,   setCurrent]   = useState(0)
  const [paused,    setPaused]    = useState(false)
  const [activeCat, setActiveCat] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [])

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

      {/* Category list — floats over image on the left */}
      <motion.div
        className="hero__left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <ul className="category-list">
          {categories.map((c, i) => (
            <li
              key={c.num}
              className={`category-item ${activeCat === i ? 'active' : ''}`}
              onClick={() => setActiveCat(i)}
            >
              <span className="cat-num">{c.num}</span>
              <span className="cat-name">{c.name}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Studio name — letter-by-letter reveal */}
      <div className="hero__title">
        <h1 className="hero__title-main">
          <SplitText text="VIDEO TREE" delay={0.3} />
        </h1>
        <motion.p
          className="hero__title-tag"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Crafting Stories, Frame by Frame
        </motion.p>
      </div>

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

      {/* Counter */}
      <div className="carousel__counter">
        <span className="c-line" />
        <span>{String(current + 1).padStart(2, '0')}</span>
        <span className="c-line" />
        <span>05</span>
        <span className="c-line" />
      </div>

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
