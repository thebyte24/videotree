import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import './AboutPage.css'

const founders = [
  {
    name: 'Nani Narendra',
    role: 'Chairman & Founder',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=85',
    bio: 'The creative force behind Video Tree, Nani brings nearly a decade of experience capturing weddings across India. His eye for authentic emotion and cinematic storytelling has made Video Tree one of Visakhapatnam\'s most sought-after studios.',
    socials: { fb: '#', ig: '#', tw: '#' },
    bw: false,
  },
  {
    name: 'Naveen',
    role: 'Co-founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85',
    bio: 'Naveen leads the videography and post-production side of Video Tree. With a passion for cinematic films and a meticulous approach to editing, he ensures every wedding film is a timeless keepsake.',
    socials: { fb: '#', ig: '#', tw: '#' },
    bw: true,
  },
]

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="ap">

      {/* Intro text */}
      <div className="ap__intro">
        <motion.p
          className="ap__intro-para"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          As a Visakhapatnam-based team, Video Tree brings our passion for storytelling wedding photography and videography to the heart of Andhra Pradesh. With a keen eye for capturing the essence of Indian weddings — the vibrant colors, the bustling energy, and the profound love — we ensure that every frame we create is a masterpiece filled with authenticity and beauty.
        </motion.p>
        <motion.p
          className="ap__intro-para"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Specializing in candid wedding experiences, we pride ourselves on crafting images and videos that vividly portray the emotions and moments that make your wedding day unique. Whether you're exchanging vows on the shores of Visakhapatnam or celebrating amidst the city's vibrant culture, we're dedicated to preserving your cherished memories in stunning detail.
        </motion.p>
        <motion.p
          className="ap__intro-para"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
        >
          Our commitment to excellence knows no bounds, and we're thrilled to be a part of your wedding journey, wherever it may take us. If you're seeking a Visakhapatnam-based team who shares your passion for storytelling through photography and videography, look no further than Video Tree.
        </motion.p>
      </div>

      {/* Founders heading */}
      <motion.h2
        className="ap__founders-heading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Meet Our Founders
      </motion.h2>

      {/* Founders grid */}
      <div className="ap__founders">
        {founders.map((f, i) => (
          <motion.div
            key={f.name}
            className={`ap__founder ${f.bw ? 'ap__founder--bw' : ''}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ap__founder-img-wrap">
              <img src={f.image} alt={f.name} loading="lazy" />
            </div>
            <div className="ap__founder-info">
              <p className="ap__founder-role">{f.role}</p>
              <h3 className="ap__founder-name">{f.name.toUpperCase()}</h3>
              <p className="ap__founder-bio">{f.bio}</p>
              <div className="ap__founder-socials">
                <a href={f.socials.fb} aria-label="Facebook">FB</a>
                <span>—</span>
                <a href={f.socials.ig} aria-label="Instagram">IN</a>
                <span>—</span>
                <a href={f.socials.tw} aria-label="Twitter">TW</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
