import { motion } from 'framer-motion'
import './InstaCTA.css'

const INSTAGRAM_URL = 'https://www.instagram.com/videotree.co.in'
const INSTAGRAM_HANDLE = '@videotree.co.in'

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
      <motion.a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="insta-cta__handle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {INSTAGRAM_HANDLE}
      </motion.a>
    </section>
  )
}
