import './Footer.css'

export default function Footer() {
  return (
    <>
      <div className="footer-divider" />

      <footer id="contact" className="footer">

        <div className="footer__col footer__col--follow">
          <p className="footer__label">Follow Us</p>
          <div className="footer__social-row">
            <a href="https://www.instagram.com/videotree.co.in?igsh=MW5razBuOGJnaWs1eg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <span className="footer__line" />
            <a href="https://youtube.com/@videotree.photography?si=on33dvyxgZ-fSpn1" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__col footer__col--logo">
          <p className="footer__logo-text">VIDEO TREE</p>
          <p className="footer__logo-sub">Photography · Films · Stories</p>
        </div>

        <div className="footer__col footer__col--contact">
          <p className="footer__label">Reach Us On</p>
          <p className="footer__contact">+91 88855 59655</p>
          <p className="footer__contact">videotree2015@gmail.com</p>
        </div>

      </footer>

      <div className="footer__copy">
        &copy; 2026 Video Tree. All Rights Reserved
      </div>
    </>
  )
}
