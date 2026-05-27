import { motion } from 'framer-motion'
import './InstaCTA.css'

export default function InstaCTA() {
  return (
    <section className="insta-cta">
      <div className="botanical botanical--insta" aria-hidden="true" />
      <motion.h2
        className="insta-cta__heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
      >
        Follow Us On Instagram
      </motion.h2>
      <motion.p
        className="insta-cta__handle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        @ videotree
      </motion.p>
    </section>
  )
}
