import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { useApi } from '../hooks/useApi'
import { apiGetCategory } from '../api/client'
import './GalleryCategoryPage.css'

export default function GalleryCategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useApi(() => apiGetCategory(category), [category])

  useEffect(() => { window.scrollTo(0, 0) }, [category])

  if (loading) {
    return <div className="gcpage gcpage--loading"><div className="page-spinner" /></div>
  }

  if (error || !data) {
    return (
      <div className="gcpage__notfound">
        <p>Category not found.</p>
        <button onClick={() => navigate('/galleries')}>Back to Galleries</button>
      </div>
    )
  }

  const photos = data.photos || []

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category])

  if (!data) {
    return (
      <div className="gcpage__notfound">
        <p>Category not found.</p>
        <button onClick={() => navigate('/galleries')}>Back to Galleries</button>
      </div>
    )
  }

  return (
    <div className="gcpage">
      {/* Hero banner */}
      <div className="gcpage__hero">
        <img src={data.coverImage || photos[0] || ''} alt={data.label} className="gcpage__hero-img" />
        <div className="gcpage__hero-overlay" />
        <div className="gcpage__hero-content">
          <motion.h1
            className="gcpage__hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {data.label}
          </motion.h1>
          <motion.p
            className="gcpage__hero-desc"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {data.description}
          </motion.p>
          <motion.button
            className="gcpage__back"
            onClick={() => navigate('/galleries')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ← All Galleries
          </motion.button>
        </div>
      </div>

      {/* Photo grid */}
      <div className="gcpage__grid">
        {data.photos.map((src, i) => (
          <motion.div
            key={i}
            className="gcpage__item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={src} alt={`${data.label} ${i + 1}`} loading="lazy" />
          </motion.div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
