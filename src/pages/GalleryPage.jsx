import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import './GalleryPage.css'

const categories = [
  {
    slug: 'weddings',
    label: 'WEDDINGS',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1400&q=90',
  },
  {
    slug: 'shoots',
    label: 'SHOOTS',
    image: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1400&q=90',
  },
  {
    slug: 'ceremonies',
    label: 'CEREMONIES',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1400&q=90',
  },
  {
    slug: 'birthdays',
    label: 'BIRTHDAYS',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=90',
  },
]

export default function GalleryPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="gallery-page">
      {categories.map((cat, i) => (
        <motion.section
          key={cat.slug}
          className="gallery-page__section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={cat.image} alt={cat.label} className="gallery-page__bg" loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="gallery-page__overlay" />
          <div className="gallery-page__content">
            <motion.h2
              className="gallery-page__title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {cat.label.split('').map((ch, j) => (
                <span key={j} style={{ animationDelay: `${j * 0.04}s` }}>{ch === ' ' ? '\u00A0' : ch}</span>
              ))}
            </motion.h2>
            <motion.button
              className="gallery-page__cta"
              onClick={() => navigate(`/galleries/${cat.slug}`)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              View Gallery
            </motion.button>
          </div>
        </motion.section>
      ))}
      <Footer />
    </div>
  )
}
