import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { apiGetEvent } from '../api/client'
import Footer from '../components/Footer'
import './EventDetailPage.css'

export default function EventDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: ev, loading, error } = useApi(() => apiGetEvent(slug), [slug])
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => { window.scrollTo(0, 0) }, [slug])
  useEffect(() => { setActiveTab('All') }, [slug])

  if (loading) {
    return <div className="edp edp--loading"><div className="page-spinner" /></div>
  }

  if (error || !ev) {
    return (
      <div className="edp__notfound">
        <p>Event not found.</p>
        <button onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    )
  }

  const allSectionTitles = ['All', ...(ev.sections || []).map(s => s.title)]

  const visiblePhotos = activeTab === 'All'
    ? ev.sections.flatMap(s => s.photos)
    : ev.sections.find(s => s.title === activeTab)?.photos ?? []

  return (
    <div className="edp">
      {/* Header */}
      <div className="edp__header">
        <motion.h1
          className="edp__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {ev.couple}
        </motion.h1>
        <motion.p
          className="edp__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {ev.location}&nbsp;&nbsp;·&nbsp;&nbsp;{ev.date}
        </motion.p>
        <motion.p
          className="edp__tagline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {ev.tagline}
        </motion.p>
      </div>

      {/* Section tabs */}
      <div className="edp__tabs">
        {allSectionTitles.map(tab => (
          <button
            key={tab}
            className={`edp__tab ${activeTab === tab ? 'edp__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="edp__grid">
        {visiblePhotos.map((src, i) => (
          <motion.div
            key={`${activeTab}-${i}`}
            className="edp__photo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={src} alt={`${ev.couple} ${i + 1}`} loading="lazy" />
          </motion.div>
        ))}
      </div>

      {/* Story / blog text */}
      <div className="edp__story">
        <h2 className="edp__story-heading">
          {ev.couple} Wedding – {ev.location}
        </h2>
        {ev.story.map((para, i) => (
          <motion.p
            key={i}
            className="edp__story-para"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            {para}
          </motion.p>
        ))}

        {/* CTAs */}
        <div className="edp__ctas">
          <a
            href="https://wa.me/918885559655?text=Hi%20Video%20Tree%2C%20I%27d%20like%20to%20enquire%20about%20wedding%20photography."
            target="_blank"
            rel="noopener noreferrer"
            className="edp__cta edp__cta--whatsapp"
          >
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.774L0 32l8.476-2.003A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 20.455c-.398-.199-2.355-1.162-2.72-1.295-.365-.133-.63-.199-.896.199-.265.398-1.029 1.295-1.261 1.56-.232.265-.465.298-.863.1-.398-.199-1.681-.62-3.203-1.977-1.184-1.057-1.983-2.362-2.215-2.76-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.896-2.16-1.228-2.957-.323-.776-.651-.671-.896-.683l-.763-.013c-.265 0-.697.1-1.062.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.854 1.626 4.12c.199.265 2.808 4.287 6.803 6.014.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.099-.166-.365-.265-.763-.464z"/>
            </svg>
            Say Hi on WhatsApp for Callback
          </a>
          <button
            className="edp__cta edp__cta--book"
            onClick={() => navigate('/')}
          >
            Contact Us to Book Your Wedding Photography
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
