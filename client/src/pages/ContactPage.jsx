import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import InstaCTA from '../components/InstaCTA'
import Footer from '../components/Footer'
import './ContactPage.css'

const CONTACT_EMAIL = 'videotree2015@gmail.com'
const WHATSAPP_NUMBER = '918885559655'

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', address: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.phone && !/^[+\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Compose mailto link as interim solution until backend is ready
    const subject = encodeURIComponent(`Wedding Enquiry — ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\nEvent Date: ${form.date || 'N/A'}\nEvent Address: ${form.address || 'N/A'}\n\nMessage:\n${form.message}`
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="cp">

      {/* Main two-column section */}
      <div className="cp__body">

        {/* Left — title + contact info */}
        <div className="cp__left">
          <motion.h1
            className="cp__title"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Contact Us
          </motion.h1>

          <motion.div
            className="cp__info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="cp__info-item">
              <p className="cp__info-label">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="cp__info-value cp__info-link">
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">Address</p>
              <p className="cp__info-value">Visakhapatnam, Andhra Pradesh, India</p>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">Call Us</p>
              <a href="tel:+918885559655" className="cp__info-value cp__info-link">
                +91 88855 59655
              </a>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">WhatsApp</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Video%20Tree%2C%20I%27d%20like%20to%20enquire%20about%20your%20photography%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="cp__info-value cp__info-link"
              >
                +91 88855 59655
              </a>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">Instagram</p>
              <a
                href="https://www.instagram.com/videotree.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="cp__info-value cp__info-link"
              >
                @videotree.co.in
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right — contact form */}
        <motion.div
          className="cp__form-wrap"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {submitted ? (
            <div className="cp__success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <h3 className="cp__success-title">Message Sent!</h3>
              <p className="cp__success-desc">
                Your email client should have opened. If not, reach us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or WhatsApp us.
              </p>
              <button className="cp__send" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', address: '', message: '' }) }}>
                Send Another
              </button>
            </div>
          ) : (
            <form className="cp__form" onSubmit={handleSubmit} noValidate>
              <div className="cp__field">
                <input
                  className={`cp__input ${errors.name ? 'cp__input--error' : ''}`}
                  type="text"
                  name="name"
                  placeholder="NAME *"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {errors.name && <span className="cp__error">{errors.name}</span>}
              </div>
              <div className="cp__field">
                <input
                  className={`cp__input ${errors.email ? 'cp__input--error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="E-MAIL *"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <span className="cp__error">{errors.email}</span>}
              </div>
              <div className="cp__field">
                <input
                  className={`cp__input ${errors.phone ? 'cp__input--error' : ''}`}
                  type="tel"
                  name="phone"
                  placeholder="PHONE"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                {errors.phone && <span className="cp__error">{errors.phone}</span>}
              </div>
              <input
                className="cp__input"
                type="date"
                name="date"
                placeholder="EVENT DATE"
                value={form.date}
                onChange={handleChange}
              />
              <input
                className="cp__input"
                type="text"
                name="address"
                placeholder="EVENT ADDRESS"
                value={form.address}
                onChange={handleChange}
              />
              <textarea
                className="cp__textarea"
                name="message"
                placeholder="TELL US MORE"
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
              <button className="cp__send" type="submit">Send Message</button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Google Map */}
      <div className="cp__map">
        <iframe
          title="Video Tree Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.123456789!2d83.3184!3d17.7231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395b0000000001%3A0x0!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="420"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <InstaCTA />
      <Footer />
    </div>
  )
}
