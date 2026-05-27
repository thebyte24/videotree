import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import GalleryStrip from './components/GalleryStrip'
import InstaCTA from './components/InstaCTA'
import Footer from './components/Footer'
import Reviews from './components/Reviews'
import ScrollTop from './components/ScrollTop'
import WhatsAppButton from './components/WhatsAppButton'
import GalleryPage from './pages/GalleryPage'
import GalleryCategoryPage from './pages/GalleryCategoryPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import './App.css'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Events />
      <Reviews />
      <GalleryStrip />
      <InstaCTA />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galleries" element={<GalleryPage />} />
        <Route path="/galleries/:category" element={<GalleryCategoryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <WhatsAppButton />
      <ScrollTop />
    </>
  )
}
