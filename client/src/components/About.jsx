import { motion } from 'framer-motion'
import './About.css'

const stats = [
  { num: '6000',  label: 'Events' },
  { num: '9000',  label: 'Albums' },
  { num: '90000', label: 'Moments' },
  { num: '15',    label: 'Years' },
  { num: '2839',  label: 'Clients' },
]

export default function About() {
  return (
    <>
      <section id="about-us" className="about">

        {/* ── Dark founder card ── */}
        <motion.div
          className="about__card"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wavy dark background */}
          <div className="about__card-bg" />

          {/* Nikon badge — top right */}
          <div className="about__card-badge">
            <svg viewBox="0 0 52 28" xmlns="http://www.w3.org/2000/svg">
              <rect width="52" height="28" rx="3" fill="#FFD700"/>
              <text x="26" y="19" textAnchor="middle"
                fontFamily="Arial Black, Arial" fontWeight="900"
                fontSize="13" fill="#000" letterSpacing="0.5">
                Nikon
              </text>
            </svg>
          </div>

          {/* Person photo in bordered frame */}
          <div className="about__card-frame">
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80"
              alt="Founder"
              className="about__card-photo"
            />
          </div>

          {/* Text — right side of card */}
          <div className="about__card-text">
            <p className="about__card-pre">THRILLED TO</p>
            <p className="about__card-announce">ANNOUNCE</p>
            <p className="about__card-sub">OUR ASSOCIATION WITH</p>
            <p className="about__card-name">VIDEO TREE</p>
            <p className="about__card-handle">@videotree</p>
          </div>
        </motion.div>

        {/* ── Cream bio card ── */}
        <motion.div
          className="about__bio"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="about__bio-role">Chairman &amp; Founder</p>
          <p className="about__bio-text">
            The creative force behind Video Tree, with a deep passion for crafting
            stunning wedding films and photographs. With nearly a decade of
            experience spanning across India, dedicated to capturing the true
            essence of every moment through the lens.
          </p>
          <span className="about__bio-scroll">↓</span>
        </motion.div>

      </section>

      {/* ── Stats bar ── */}
      <motion.div
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
    </>
  )
}
