import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const solidNav = !isHome || scrolled

  function handleAnchor(e, anchor) {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const navLinks = (
    <>
      <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate('/') }}>Home</a>
      <Link to="/galleries" className={`nav-link ${location.pathname.startsWith('/galleries') ? 'active' : ''}`}>Galleries</Link>
      <Link to="/events" className={`nav-link ${location.pathname.startsWith('/events') ? 'active' : ''}`}>Events</Link>
      <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
      <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
    </>
  )

  return (
    <>
      <motion.header
        className={`navbar ${solidNav ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="navbar__logo">
          <Link to="/" className="navbar__logo-text">VIDEO TREE</Link>
        </div>

        {/* Desktop nav links */}
        <nav className="navbar__links">
          {navLinks}
        </nav>

        {/* Desktop social icons */}
        <div className="navbar__social">
          <a href="#" aria-label="Instagram" className="social-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="social-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="social-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`burger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`burger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`burger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {navLinks}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
