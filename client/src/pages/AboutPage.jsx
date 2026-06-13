import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import founderImg from '../assets/founder.png'
import SEO from '../components/SEO'
import './AboutPage.css'

const sections = [
  {
    heading: 'Rooted in Trust, Framing Your Stories Since 2009',
    body: 'Welcome to Video Tree, where your precious moments are nurtured into timeless visual legacies. Established in 2009, we have been a trusted name in the photography and videography industry for over 17 years. Just like a tree that grows stronger with deep roots, our bond with our clients has grown through generations of trust and love. We don\'t just capture events; we freeze emotions, celebrate relationships, and craft cinematic art that you will cherish for a lifetime.',
  },
  {
    heading: 'Generation of Trust: From One Wedding to Twenty',
    body: 'Our greatest achievement isn\'t just the awards or technology — it is the loyalty of our clients. We are incredibly proud to say that we are the "Official Family Filmmakers" for numerous families. In fact, we have had the rare honor of capturing 15 to 20 weddings within the exact same extended families! From parents to children, siblings to cousins, being chosen repeatedly to document a family\'s history is a testament to our professional quality and heartfelt commitment.',
  },
  {
    heading: 'Our State-of-the-Art Video Editing Lab',
    body: 'What truly sets Video Tree apart is our advanced, in-house Video Editing Lab. We believe that a great shot is only half the story; the real magic happens on the editing table. With high-end infrastructure, premium color grading, and a passionate team of creative editors, we ensure that every video we deliver has an impeccable cinematic look and top-notch production value. Because we handle everything from the first click to the final cut in-house, your memories never leave safe hands.',
  },
]

const whyUs = [
  '17+ Years of Legacy: Delivering smiles, excellence, and stunning visuals since 2009.',
  'Unmatched Trust: Proudly chosen to shoot up to 20 weddings in single families over the years.',
  'End-to-End Solutions: Complete photography and cinematic video creation under one roof.',
  'Advanced In-House Lab: Professional, high-definition editing and crystal-clear sound design.',
  'Passionate Team: Skilled photographers and cinematographers who treat your event as their own.',
]

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="ap">
      <SEO
        title="About Us — 17+ Years of Wedding Photography"
        description="Learn about Video Tree, Visakhapatnam's trusted wedding photography studio since 2009. 17+ years, 2839+ clients, and generations of family memories."
        canonical="/about"
        keywords="about video tree, wedding photographer visakhapatnam, photography studio vizag since 2009"
      />

      {/* Page title */}
      <motion.div
        className="ap__title-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="ap__label">About Video Tree</p>
        <h1 className="ap__page-title">Rooted in Trust,<br />Framing Your Stories</h1>
      </motion.div>

      {/* Content sections */}
      <div className="ap__intro">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            className="ap__section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.12 }}
          >
            <h2 className="ap__section-heading">{s.heading}</h2>
            <p className="ap__intro-para">{s.body}</p>
          </motion.div>
        ))}

        {/* Why Choose */}
        <motion.div
          className="ap__section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="ap__section-heading">Why Choose Video Tree?</h2>
          <ul className="ap__why-list">
            {whyUs.map((item, i) => (
              <li key={i} className="ap__why-item">{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.p
          className="ap__intro-para ap__closing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Thank you for letting us be a part of your journey. Let's grow more memories together under the shade of the Video Tree!
        </motion.p>
      </div>

      {/* Founder */}
      <motion.h2
        className="ap__founders-heading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Meet Our Founder
      </motion.h2>

      <div className="ap__founders">
        <motion.div
          className="ap__founder"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ap__founder-img-wrap">
            <img src={founderImg} alt="Naidu" loading="lazy" />
          </div>
          <div className="ap__founder-info">
            <p className="ap__founder-role">Chairman &amp; Founder</p>
            <h3 className="ap__founder-name">MUVVALA NAIDU</h3>
            <p className="ap__founder-bio">
              The creative force behind Video Tree, with a deep passion for crafting stunning Photography and Video Editing. With nearly a decade of experience spanning across India, dedicated to capturing the true essence of every moment through the lens.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
