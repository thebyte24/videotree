import { useEffect } from 'react'
import { motion } from 'framer-motion'
import InstaCTA from '../components/InstaCTA'
import Footer from '../components/Footer'
import './ContactPage.css'

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  function handleSubmit(e) {
    e.preventDefault()
    // form submission logic here
  }

  return (
    <div className="cp">

      {/* Main two-column section */}
      <div className="cp__body">

        {/* Left — title + photo + contact info */}
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
            className="cp__photo-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=85"
              alt="Founder"
            />
          </motion.div>

          <motion.div
            className="cp__info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="cp__info-item">
              <p className="cp__info-label">Email</p>
              <p className="cp__info-value">videotree2015@gmail.com</p>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">Address</p>
              <p className="cp__info-value">Visakhapatnam, Andhra Pradesh, India</p>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">Call Us</p>
              <p className="cp__info-value">+91 88855 59655</p>
            </div>
            <div className="cp__info-item">
              <p className="cp__info-label">WhatsApp</p>
              <a
                href="https://wa.me/918885559655"
                target="_blank"
                rel="noopener noreferrer"
                className="cp__info-value cp__info-link"
              >
                +91 88855 59655
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right — contact form */}
        <motion.form
          className="cp__form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <input className="cp__input" type="text" placeholder="NAME" required />
          <input className="cp__input" type="email" placeholder="E-MAIL" required />
          <input className="cp__input" type="tel" placeholder="PHONE" />
          <input className="cp__input" type="date" placeholder="EVENT DATE" />
          <input className="cp__input" type="text" placeholder="EVENT ADDRESS" />
          <textarea className="cp__textarea" placeholder="TELL US MORE" rows={5} />
          <button className="cp__send" type="submit">Send</button>
        </motion.form>
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
