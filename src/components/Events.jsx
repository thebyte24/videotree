import { motion } from 'framer-motion'
import './Events.css'

const events = [
  {
    img: 'https://images.unsplash.com/photo-1622495966027-e0173192c728?w=900&q=85',
    location: 'Hyderabad, Telangana',
    couple: 'Arjun & Priya',
    side: 'left', size: 'large', from: 'left'
  },
  {
    img: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&q=85',
    location: 'Visakhapatnam, Andhra',
    couple: 'Rahul & Divya',
    side: 'right', size: 'small', from: 'right'
  },
  {
    img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&q=85',
    location: 'Visakhapatnam, Andhra',
    couple: 'Kiran & Meghana',
    side: 'left', size: 'small', from: 'left'
  },
  {
    img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85',
    location: 'Visakhapatnam, Andhra',
    couple: 'Jaswanth & Praharshitha',
    side: 'right', size: 'large', from: 'right'
  },
]

export default function Events() {
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
        {events.map((e, i) => (
          <motion.div
            key={i}
            className={`event-item event-item--${e.side} event-item--${e.size}`}
            initial={{ opacity: 0, x: e.from === 'left' ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Image wrapper — overflow hidden + scale reveal */}
            <div className="event-item__img-wrap">
              <motion.img
                src={e.img}
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
