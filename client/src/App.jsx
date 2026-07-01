import { lazy, Suspense } from 'react'
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
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './admin/ProtectedRoute'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import './App.css'

// Lazy-load heavy pages — only downloaded when the user navigates to them
const GalleryPage         = lazy(() => import('./pages/GalleryPage'))
const GalleryCategoryPage = lazy(() => import('./pages/GalleryCategoryPage'))
const EventsPage          = lazy(() => import('./pages/EventsPage'))
const EventDetailPage     = lazy(() => import('./pages/EventDetailPage'))
const AboutPage           = lazy(() => import('./pages/AboutPage'))
const ContactPage         = lazy(() => import('./pages/ContactPage'))
const NotFoundPage        = lazy(() => import('./pages/NotFoundPage'))
const AdminLogin          = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard      = lazy(() => import('./admin/AdminDashboard'))

const PageSpinner = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="page-spinner" />
  </div>
)

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
    <ErrorBoundary>
      <AdminAuthProvider>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Admin routes — no Navbar/WhatsApp/ScrollTop */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Suspense fallback={<PageSpinner />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/galleries" element={<GalleryPage />} />
                      <Route path="/galleries/:category" element={<GalleryCategoryPage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/events/:slug" element={<EventDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                  <WhatsAppButton />
                  <ScrollTop />
                </>
              }
            />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </ErrorBoundary>
  )
}
