import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="nfp">
      <div className="nfp__content">
        <motion.p
          className="nfp__code"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          404
        </motion.p>
        <motion.h1
          className="nfp__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Page Not Found
        </motion.h1>
        <motion.p
          className="nfp__desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div
          className="nfp__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <button className="nfp__btn nfp__btn--primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
          <button className="nfp__btn nfp__btn--secondary" onClick={() => navigate('/galleries')}>
            View Galleries
          </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
