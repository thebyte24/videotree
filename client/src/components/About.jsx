import { motion } from 'framer-motion'
import './About.css'

const stats = [
  { num: '15',   label: 'Years' },
  { num: '2839', label: 'Clients' },
]

export default function About() {
  return (
    <motion.div
      id="about-us"
      className="stats-bar"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {stats.map((s, i) => (
        <div className="stats-bar__item" key={i}>
          <span className="stats-bar__num">{s.num}</span>
          <span className="stats-bar__label">{s.label}</span>
        </div>
      ))}
    </motion.div>
  )
}
