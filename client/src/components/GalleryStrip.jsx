import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { apiGetConfig } from '../api/client'
import { photoUrl, photoPosition } from '../utils/photoUtils'
import './GalleryStrip.css'

export default function GalleryStrip() {
  const navigate = useNavigate()
  const { data } = useApi(() => apiGetConfig('galleryStrip'))
  const photos = data?.value || []

  // Don't render the strip at all if no photos configured
  if (!photos.length) return null

  return (
    <section id="galleries" className="gallery-strip" onClick={() => navigate('/galleries')} style={{ cursor: 'pointer' }}>
      {photos.map((entry, i) => (
        <motion.div
          key={i}
          className="gallery-strip__col"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
        >
          <img
            src={photoUrl(entry)}
            alt={`Gallery ${i + 1}`}
            loading="lazy"
            style={{ objectPosition: photoPosition(entry) }}
          />
        </motion.div>
      ))}
      <div className="botanical botanical--strip" aria-hidden="true" />
    </section>
  )
}
