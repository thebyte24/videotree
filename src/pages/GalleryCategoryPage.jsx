import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import './GalleryCategoryPage.css'

const categoryData = {
  weddings: {
    label: 'Weddings',
    description: 'Timeless moments from beautiful wedding celebrations.',
    photos: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=85',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=85',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85',
    ],
  },
  shoots: {
    label: 'Shoots',
    description: 'Creative portrait and couple shoots full of emotion.',
    photos: [
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=85',
      'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=85',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=85',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=85',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85',
    ],
  },
  ceremonies: {
    label: 'Ceremonies',
    description: 'Sacred rituals and cultural ceremonies captured with care.',
    photos: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=85',
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=85',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=85',
      'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=85',
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=85',
    ],
  },
  birthdays: {
    label: 'Birthdays',
    description: 'Joyful birthday celebrations filled with colour and laughter.',
    photos: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=85',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=85',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=85',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=85',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85',
    ],
  },
}

export default function GalleryCategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const data = categoryData[category]

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
        <img src={data.photos[0]} alt={data.label} className="gcpage__hero-img" />
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
