import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { apiGetEvents } from '../api/client'
import './Events.css'

export default function Events() {
  const navigate = useNavigate()
  const { data } = useApi(apiGetEvents)
  const featured = (data || []).slice(0, 4).filter(e => e.coverImage)

  return (
    <section id="events" className="events">

      <motion.h2
        className="events__heading"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        Recent Events
      </motion.h2>

      <div className="events__grid">
        {featured.map((e, i) => (
          <motion.div
            key={e.slug}
            className={`event-item event-item--${i % 2 === 0 ? 'left' : 'right'} event-item--${i % 2 === 0 ? 'large' : 'small'}`}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/events/${e.slug}`)}
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="event-item__img-wrap">
              <motion.img
                src={e.coverImage}
                alt={e.couple}
                loading="lazy"
                className="event-item__img"
                initial={{ scale: 1.12, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.1, delay: i * 0.07 + 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <motion.p
              className="event-item__location"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 + 0.4 }}
            >
              {e.location}
            </motion.p>
            <motion.p
              className="event-item__couple"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 + 0.5 }}
            >
              {e.couple}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="with-love"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        with love
      </motion.div>

      <div className="botanical botanical--events" aria-hidden="true" />
    </section>
  )
}
