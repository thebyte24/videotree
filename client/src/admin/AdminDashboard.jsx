import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import {
  apiGetCategories, apiUpdateCategory,
  apiGetEvents, apiUpdateEvent, apiCreateEvent, apiDeleteEvent,
  apiGetConfig, apiSetConfig,
  apiUploadImages,
} from '../api/client'
import './Admin.css'

// ── Upload images to server, return URLs ─────────────────────────────────────
async function uploadFiles(files) {
  const data = await apiUploadImages(files)
  return data.urls
}

// ── Image Upload + List Editor ───────────────────────────────────────────────
function ImageListEditor({ images, onChange, label, accept = 'image/*' }) {
  const inputRef   = useRef(null)
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')

  async function processFiles(files) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    try {
      const urls = await uploadFiles(files)
      onChange([...images, ...urls])
    } catch (e) {
      setError(e.message || 'Upload failed')
    }
    setUploading(false)
  }

  function handleFileInput(e) {
    processFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  function remove(idx) {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div className="img-editor">
      <p className="img-editor__label">{label}</p>

      <div
        className={`img-editor__dropzone${dragging ? ' img-editor__dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload images"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
        {uploading ? (
          <div className="img-editor__uploading">
            <div className="img-editor__spinner" />
            <span>Uploading…</span>
          </div>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="img-editor__drop-text">
              <strong>Click to upload</strong> or drag & drop
            </p>
            <p className="img-editor__drop-sub">{accept.includes('video') ? 'JPG, PNG, WEBP, MP4, WEBM — multiple files supported' : 'JPG, PNG, WEBP — multiple files supported'}</p>
          </>
        )}
      </div>

      {error && <p className="img-editor__warning">⚠️ {error}</p>}

      {images.length > 0 && (
        <div className="img-editor__grid">
          {images.map((src, i) => (
            <div key={i} className="img-editor__thumb">
              <img src={src} alt="" loading="lazy" />
              <button
                className="img-editor__remove"
                onClick={() => remove(i)}
                title="Remove"
                aria-label="Remove image"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Single cover image uploader ───────────────────────────────────────────────
function CoverUploader({ value, onChange }) {
  const inputRef   = useRef(null)
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const urls = await uploadFiles([file])
      onChange(urls[0])
    } catch {
      // silently fail — user can retry
    }
    setUploading(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="cover-uploader">
      <div
        className={`cover-uploader__zone${dragging ? ' cover-uploader__zone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <div className="img-editor__uploading">
            <div className="img-editor__spinner" />
          </div>
        ) : value ? (
          <img src={value} alt="cover" className="cover-uploader__preview" />
        ) : (
          <div className="cover-uploader__placeholder">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Upload cover</span>
          </div>
        )}
      </div>
      {value && (
        <button className="cover-uploader__clear" onClick={() => onChange('')}>Remove</button>
      )}
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ['Hero Slides', 'Gallery Strip', 'Gallery Categories', 'Events']

export default function AdminDashboard() {
  const { logout } = useAdminAuth()
  const navigate   = useNavigate()
  const [tab, setTab]   = useState(0)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  // Data state
  const [heroSlides,  setHeroSlides]  = useState([])
  const [strip,       setStrip]       = useState([])
  const [categories,  setCategories]  = useState([])
  const [events,      setEvents]      = useState([])
  const [activeCat,   setActiveCat]   = useState(0)
  const [activeEvent, setActiveEvent] = useState(0)
  const [activeSection, setActiveSection] = useState(0)

  // Load all data on mount
  useEffect(() => {
    async function load() {
      setLoading(true)
      setApiError('')
      try {
        const [cats, evts, heroData, stripData] = await Promise.all([
          apiGetCategories(),
          apiGetEvents(),
          apiGetConfig('heroSlides').catch(() => ({ value: [] })),
          apiGetConfig('galleryStrip').catch(() => ({ value: [] })),
        ])
        setCategories(cats)
        setEvents(evts)
        setHeroSlides(heroData.value || [])
        setStrip(stripData.value || [])
      } catch (e) {
        setApiError('Could not connect to server. Is the backend running?')
      }
      setLoading(false)
    }
    load()
  }, [])

  function showSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── Save handlers ─────────────────────────────────────────────────────────

  async function saveHero() {
    await apiSetConfig('heroSlides', heroSlides)
    showSaved()
  }

  async function saveStrip() {
    await apiSetConfig('galleryStrip', strip)
    showSaved()
  }

  async function saveCat() {
    const cat = categories[activeCat]
    await apiUpdateCategory(cat.slug, { coverImage: cat.coverImage, photos: cat.photos })
    showSaved()
  }

  async function saveEvt() {
    const evt = events[activeEvent]
    await apiUpdateEvent(evt.slug, { coverImage: evt.coverImage, sections: evt.sections })
    showSaved()
  }

  // ── Category helpers ──────────────────────────────────────────────────────

  function updateCatPhotos(photos) {
    setCategories(prev => prev.map((c, i) => i === activeCat ? { ...c, photos } : c))
  }

  function updateCatCover(url) {
    setCategories(prev => prev.map((c, i) => i === activeCat ? { ...c, coverImage: url } : c))
  }

  // ── Event helpers ─────────────────────────────────────────────────────────

  function updateEventCover(url) {
    setEvents(prev => prev.map((e, i) => i === activeEvent ? { ...e, coverImage: url } : e))
  }

  function updateSectionPhotos(photos) {
    setEvents(prev => prev.map((e, ei) => {
      if (ei !== activeEvent) return e
      return { ...e, sections: e.sections.map((s, si) => si === activeSection ? { ...s, photos } : s) }
    }))
  }

  function addEventSection() {
    const title = prompt('Section title (e.g. "Wedding", "Haldi"):')
    if (!title) return
    setEvents(prev => prev.map((e, i) =>
      i === activeEvent ? { ...e, sections: [...e.sections, { title, photos: [] }] } : e
    ))
  }

  function removeEventSection(si) {
    if (!confirm('Remove this section?')) return
    setEvents(prev => prev.map((e, i) =>
      i === activeEvent ? { ...e, sections: e.sections.filter((_, idx) => idx !== si) } : e
    ))
    setActiveSection(0)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="admin-dash admin-dash--loading">
        <div className="img-editor__spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <p>Connecting to server…</p>
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="admin-dash admin-dash--loading">
        <p style={{ color: '#e07070', maxWidth: 400, textAlign: 'center', lineHeight: 1.7 }}>{apiError}</p>
        <button className="admin-save-btn" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  const cat = categories[activeCat]
  const evt = events[activeEvent]

  return (
    <div className="admin-dash">
      {/* Header */}
      <header className="admin-dash__header">
        <div className="admin-dash__brand">
          <span className="admin-dash__logo">VT</span>
          <span className="admin-dash__title">Admin Dashboard</span>
        </div>
        <div className="admin-dash__actions">
          <button className="admin-dash__view-btn" onClick={() => navigate('/')}>View Site</button>
          <button className="admin-dash__logout" onClick={() => { logout(); navigate('/admin') }}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-dash__tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`admin-dash__tab${tab === i ? ' admin-dash__tab--active' : ''}`}
            onClick={() => setTab(i)}
          >{t}</button>
        ))}
      </nav>

      <main className="admin-dash__main">
        {saved && <div className="admin-dash__toast">✓ Saved!</div>}

        {/* ── Tab 0: Hero Slides ── */}
        {tab === 0 && (
          <div className="admin-section">
            <h2 className="admin-section__title">Homepage Hero Slideshow</h2>
            <p className="admin-section__desc">
              Upload photos <strong>or videos</strong> (mp4, webm) — they all cycle in the hero carousel. Videos autoplay muted.
            </p>
            <ImageListEditor images={heroSlides} onChange={setHeroSlides} label="Hero Slides (images + videos)" accept="image/*,video/*" />
            <button className="admin-save-btn" onClick={saveHero}>Save Hero Slides</button>
          </div>
        )}

        {/* ── Tab 1: Gallery Strip ── */}
        {tab === 1 && (
          <div className="admin-section">
            <h2 className="admin-section__title">Homepage Gallery Strip</h2>
            <p className="admin-section__desc">These images appear in the strip on the homepage.</p>
            <ImageListEditor images={strip} onChange={setStrip} label="Strip Images" />
            <button className="admin-save-btn" onClick={saveStrip}>Save Strip</button>
          </div>
        )}

        {/* ── Tab 2: Gallery Categories ── */}
        {tab === 2 && cat && (
          <div className="admin-section">
            <h2 className="admin-section__title">Gallery Categories</h2>
            <div className="admin-sidebar-layout">
              <aside className="admin-sidebar">
                {categories.map((c, i) => (
                  <button
                    key={c.slug}
                    className={`admin-sidebar__item${activeCat === i ? ' admin-sidebar__item--active' : ''}`}
                    onClick={() => setActiveCat(i)}
                  >{c.label}</button>
                ))}
              </aside>
              <div className="admin-editor">
                <h3 className="admin-editor__name">{cat.label}</h3>
                <div className="admin-field">
                  <label className="admin-field__label">Cover Image</label>
                  <CoverUploader value={cat.coverImage} onChange={updateCatCover} />
                </div>
                <ImageListEditor images={cat.photos} onChange={updateCatPhotos} label="Gallery Photos" />
                <button className="admin-save-btn" onClick={saveCat}>Save Category</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Events ── */}
        {tab === 3 && evt && (
          <div className="admin-section">
            <h2 className="admin-section__title">Events</h2>
            <div className="admin-sidebar-layout">
              <aside className="admin-sidebar">
                {events.map((e, i) => (
                  <button
                    key={e.slug}
                    className={`admin-sidebar__item${activeEvent === i ? ' admin-sidebar__item--active' : ''}`}
                    onClick={() => { setActiveEvent(i); setActiveSection(0) }}
                  >{e.couple}</button>
                ))}
              </aside>
              <div className="admin-editor">
                <h3 className="admin-editor__name">{evt.couple}</h3>
                <p className="admin-editor__meta">{evt.location} · {evt.date}</p>
                <div className="admin-field">
                  <label className="admin-field__label">Cover Image</label>
                  <CoverUploader value={evt.coverImage} onChange={updateEventCover} />
                </div>
                <div className="admin-sections">
                  <div className="admin-sections__header">
                    <p className="admin-field__label">Sections</p>
                    <button className="admin-sections__add" onClick={addEventSection}>+ Add Section</button>
                  </div>
                  <div className="admin-sections__tabs">
                    {evt.sections.map((s, si) => (
                      <div key={si} className="admin-sections__tab-wrap">
                        <button
                          className={`admin-sections__tab${activeSection === si ? ' admin-sections__tab--active' : ''}`}
                          onClick={() => setActiveSection(si)}
                        >{s.title}</button>
                        <button className="admin-sections__del" onClick={() => removeEventSection(si)} title="Remove section">×</button>
                      </div>
                    ))}
                  </div>
                  {evt.sections[activeSection] && (
                    <ImageListEditor
                      images={evt.sections[activeSection].photos}
                      onChange={updateSectionPhotos}
                      label={`Photos — ${evt.sections[activeSection].title}`}
                    />
                  )}
                </div>
                <button className="admin-save-btn" onClick={saveEvt}>Save Event</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
