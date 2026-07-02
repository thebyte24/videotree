import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'
import ImageWithSkeleton from '../components/ImageWithSkeleton'
import { useApi } from '../hooks/useApi'
import { apiGetCategory } from '../api/client'
import { photoUrl, photoPosition } from '../utils/photoUtils'
import SEO from '../components/SEO'
import './GalleryCategoryPage.css'

// How many photos to show initially, then load more on scroll
const PAGE_SIZE = 24

export default function GalleryCategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useApi(() => apiGetCategory(category), [category])
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [prevCategory, setPrevCategory] = useState(category)

  if (category !== prevCategory) {
    setPrevCategory(category)
    setVisible(PAGE_SIZE)
  }

  useEffect(() => { window.scrollTo(0, 0) }, [category])

  // Infinite-scroll: load more photos as user scrolls near bottom
  const loadMore = useCallback(() => {
    if (!data) return
    const total = (data.photos || []).length
    setVisible(v => Math.min(v + PAGE_SIZE, total))
  }, [data])

  useEffect(() => {
    function onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
        loadMore()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loadMore])

  if (loading) {
    return (
      <div className="gcpage gcpage--loading">
        <div className="page-spinner" />
      </div>
    )
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
  const visiblePhotos = photos.slice(0, visible)

  return (
    <div className="gcpage">
      <SEO
        title={`${data.label} Photography Visakhapatnam`}
        description={data.description || `View our ${data.label} photography portfolio. Beautiful moments captured by Video Tree in Visakhapatnam.`}
        canonical={`/galleries/${category}`}
        keywords={`${data.label.toLowerCase()} photography vizag, ${data.label.toLowerCase()} photographer visakhapatnam`}
        ogImage={data.coverImage || undefined}
      />

      {/* Hero banner */}
      <div className="gcpage__hero">
        <img
          src={photoUrl(data.coverImage || photos[0] || '')}
          alt={data.label}
          className="gcpage__hero-img"
          style={{ objectPosition: photoPosition(data.coverImage || photos[0]) }}
        />
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

      {/* Photo grid — only renders visible slice */}
      <div className="gcpage__grid">
        {visiblePhotos.map((entry, i) => (
          <motion.div
            key={i}
            className="gcpage__item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setLightboxIdx(i)}
            style={{ cursor: 'pointer' }}
          >
            <ImageWithSkeleton
              src={photoUrl(entry)}
              alt={`${data.label} ${i + 1}`}
              loading={i < 6 ? 'eager' : 'lazy'}
              style={{ objectPosition: photoPosition(entry) }}
            />
          </motion.div>
        ))}
      </div>

      {/* Load more indicator */}
      {visible < photos.length && (
        <div className="gcpage__load-more">
          <button className="gcpage__load-more-btn" onClick={loadMore}>
            Load more ({photos.length - visible} remaining)
          </button>
        </div>
      )}

      {/* Lightbox — with adjacent image preloading */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNav={setLightboxIdx}
        />
      )}

      {/* YouTube playlist link */}
      {data.youtubeUrl && (
        <div className="gcpage__yt-wrap">
          <a
            href={data.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gcpage__yt-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch More on YouTube
          </a>
        </div>
      )}

      <Footer />
    </div>
  )
}
