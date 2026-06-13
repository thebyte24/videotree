import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { useApi } from '../hooks/useApi'
import { apiGetCategories } from '../api/client'
import { photoUrl, photoPosition } from '../utils/photoUtils'
import SEO from '../components/SEO'
import './GalleryPage.css'

export default function GalleryPage() {
  const navigate = useNavigate()
  const { data: categories, loading } = useApi(apiGetCategories)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (loading || !categories) {
    return <div className="gallery-page gallery-page--loading"><div className="page-spinner" /></div>
  }

  return (
    <div className="gallery-page">
      <SEO
        title="Wedding Photography Gallery — Weddings, Engagements & More"
        description="Browse Video Tree's photography gallery — weddings, engagements, pre-weddings, haldi, half-saree, birthdays and ceremonies in Visakhapatnam."
        canonical="/galleries"
        keywords="wedding photography gallery vizag, engagement photos visakhapatnam, pre-wedding gallery andhra pradesh"
      />
      {categories.map((cat, i) => (
        <motion.section
          key={cat.slug}
          className="gallery-page__section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={photoUrl(cat.coverImage || '')}
            alt={cat.label || ''}
            className="gallery-page__bg"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="gallery-page__overlay" />
          <div className="gallery-page__content">
            <motion.h2
              className="gallery-page__title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {(cat.label || '').split('').map((ch, j) => (
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
