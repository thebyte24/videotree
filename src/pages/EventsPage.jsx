import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { events } from '../data/events'
import Footer from '../components/Footer'
import InstaCTA from '../components/InstaCTA'
import './EventsPage.css'

export default function EventsPage() {
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="ep">
      <div className="ep__grid">
        {events.map((ev, i) => (
          <motion.article
            key={ev.slug}
            className="ep__card"
            onClick={() => navigate(`/events/${ev.slug}`)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ep__img-wrap">
              <img src={ev.coverImage} alt={ev.couple} loading="lazy" />
            </div>
            <p className="ep__location">{ev.location}</p>
            <h2 className="ep__couple">{ev.couple}</h2>
            <p className="ep__tagline">{ev.tagline}</p>
          </motion.article>
        ))}
      </div>
      <InstaCTA />
      <Footer />
    </div>
  )
}
