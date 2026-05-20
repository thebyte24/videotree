import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './GalleryStrip.css'

const photos = [
  'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=700&q=85',
  'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=700&q=85',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&q=85',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=700&q=85',
]

export default function GalleryStrip() {
  const navigate = useNavigate()

  return (
    <section id="galleries" className="gallery-strip" onClick={() => navigate('/galleries')} style={{ cursor: 'pointer' }}>
      {photos.map((src, i) => (
        <motion.div
          key={i}
          className="gallery-strip__col"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
        >
          <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
        </motion.div>
      ))}
      <div className="botanical botanical--strip" aria-hidden="true" />
    </section>
  )
}
