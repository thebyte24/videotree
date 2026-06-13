import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import {
  apiGetCategories, apiUpdateCategory,
  apiGetEvents, apiUpdateEvent, apiCreateEvent, apiDeleteEvent,
  apiGetConfig, apiSetConfig,
  apiUploadImages,
  apiGetReviews, apiCreateReview, apiUpdateReview, apiDeleteReview,
} from '../api/client'
import { normalisePhoto, photoUrl } from '../utils/photoUtils'
import FocalPointEditor from '../components/FocalPointEditor'
import './Admin.css'

// ── Upload images to server, return URLs ─────────────────────────────────────
async function uploadFiles(files) {
  const data = await apiUploadImages(files)
  return data.urls
}

// Convert photo entries — preserve { url, x, y } objects, plain strings stay as strings
function photosToUrls(photos) {
  return photos.map(p => {
    if (typeof p === 'string') return p
    // If focal point is set (non-default), save as object to preserve it
    if (p.x !== undefined && p.y !== undefined && (p.x !== 50 || p.y !== 50)) {
      return { url: p.url || p, x: p.x, y: p.y }
    }
    return p.url || p
  })
}

// ── Image Upload + List Editor ───────────────────────────────────────────────
function ImageListEditor({ images, onChange, onRemove, label, accept = 'image/*', enableFocalPoint = false }) {
  const inputRef   = useRef(null)
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [editingFocal, setEditingFocal] = useState(null)

  async function processFiles(files) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    try {
      const urls = await uploadFiles(files)
      onChange([...images, ...urls])
    } catch (e) {
      const msg = e.message || 'Upload failed'
      if (msg.includes('JSON') || msg.includes('unexpected')) {
        setError('Upload failed — file may be too large for the server. Try a smaller file or compress the video first.')
      } else {
        setError(msg)
      }
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

  async function remove(idx) {
    if (!window.confirm('Delete this photo? This cannot be undone.')) return
    const updated = images.filter((_, i) => i !== idx)
    onChange(updated)
    if (onRemove) await onRemove(updated)
  }

  function openFocalEditor(idx) {
    const entry = images[idx]
    const photo = normalisePhoto(entry)
    setEditingFocal({ idx, photo })
  }

  function saveFocalPoint(updated) {
    if (editingFocal === null) return
    const newImages = [...images]
    newImages[editingFocal.idx] = updated
    onChange(newImages)
    setEditingFocal(null)
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
          {images.map((entry, i) => {
            const url = photoUrl(entry)
            return (
              <div key={i} className="img-editor__thumb">
                <img src={url} alt="" loading="lazy" />
                <div className="img-editor__actions">
                  {enableFocalPoint && (
                    <button
                      className="img-editor__adjust"
                      onClick={() => openFocalEditor(i)}
                      title="Adjust focal point"
                      aria-label="Adjust focal point"
                    >⚙️ Adjust</button>
                  )}
                  <button
                    className="img-editor__remove"
                    onClick={() => remove(i)}
                    title="Delete photo"
                    aria-label="Delete photo"
                  >🗑 Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editingFocal && (
        <FocalPointEditor
          photo={editingFocal.photo}
          aspectRatio="3/2"
          onSave={saveFocalPoint}
          onClose={() => setEditingFocal(null)}
        />
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
const TABS = ['Hero Slides', 'Gallery Strip', 'Gallery Categories', 'Events', 'Reviews']

const SECTION_OPTIONS = [
  'Wedding', 'Engagement', 'Haldi', 'Mehandi', 'Haldi & Mehandi',
  'Pre-Wedding', 'Half Saree', 'Baby Shoots', 'Ceremonies',
  'Birthdays', 'Sangeeth', 'Reception', 'Ring Ceremony', 'Other',
]

// Map event section titles → gallery category slugs
const SECTION_TO_GALLERY = {
  'wedding':       'weddings',
  'engagement':    'engagement',
  'haldi':         'haldi',
  'mehandi':       'haldi',
  'haldi & mehandi': 'haldi',
  'pre-wedding':   'pre-wedding',
  'half saree':    'half-saree',
  'baby shoots':   'baby-shoots',
  'ceremonies':    'ceremonies',
  'birthdays':     'birthdays',
}

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
  const [reviews,     setReviews]     = useState([])
  const [activeCat,   setActiveCat]   = useState(0)
  const [activeEvent, setActiveEvent] = useState(0)
  const [activeSection, setActiveSection] = useState(0)

  // Video URL input state (Hero Slides)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoUrlError, setVideoUrlError] = useState('')

  function addVideoUrl() {
    const url = videoUrl.trim()
    if (!url) return
    if (!/^https?:\/\/.+\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
      setVideoUrlError('URL must be a direct video link ending in .mp4, .webm, .ogg or .mov')
      return
    }
    setVideoUrlError('')
    setVideoUrl('')
    setHeroSlides(prev => [...prev, url])
  }

  const [showSectionPicker, setShowSectionPicker] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' })
  const [editingReview, setEditingReview] = useState(null)

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
        const revs = await apiGetReviews().catch(() => [])
        setReviews(revs)
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
    await apiUpdateCategory(cat.slug, {
      label: cat.label,
      description: cat.description || '',
      coverImage: cat.coverImage || '',
      photos: photosToUrls(cat.photos || []),
      order: cat.order ?? activeCat,
      youtubeUrl: cat.youtubeUrl || '',
    })
    showSaved()
  }

  async function saveEvt() {
    const evt = events[activeEvent]
    await apiUpdateEvent(evt.slug, {
      couple: evt.couple,
      location: evt.location,
      date: evt.date,
      tagline: evt.tagline,
      story: evt.story,
      coverImage: evt.coverImage,
      sections: evt.sections.map(s => ({ ...s, photos: photosToUrls(s.photos) })),
      order: evt.order,
      youtubeUrl: evt.youtubeUrl || '',
    })

    // Sync photos to matching gallery categories
    for (const section of evt.sections) {
      if (!section.photos.length) continue
      const gallerySlug = SECTION_TO_GALLERY[section.title.toLowerCase()]
      if (!gallerySlug) continue
      const cat = categories.find(c => c.slug === gallerySlug)
      if (!cat) continue
      const existing = new Set(cat.photos.map(p => photoUrl(p)))
      const newPhotos = section.photos.filter(p => !existing.has(photoUrl(p)))
      if (!newPhotos.length) continue
      const merged = [...(cat.photos || []), ...newPhotos]
      await apiUpdateCategory(gallerySlug, {
        label: cat.label,
        description: cat.description || '',
        coverImage: cat.coverImage || '',
        photos: photosToUrls(merged),
        order: cat.order ?? 0,
        youtubeUrl: cat.youtubeUrl || '',
      })
      setCategories(prev => prev.map(c =>
        c.slug === gallerySlug ? { ...c, photos: merged } : c
      ))
    }

    showSaved()
  }

  // ── Category helpers ──────────────────────────────────────────────────────

  function updateCatPhotos(photos) {
    setCategories(prev => prev.map((c, i) => i === activeCat ? { ...c, photos } : c))
  }

  function updateCatCover(url) {
    setCategories(prev => prev.map((c, i) => i === activeCat ? { ...c, coverImage: url } : c))
  }

  function updateCatYoutube(url) {
    setCategories(prev => prev.map((c, i) => i === activeCat ? { ...c, youtubeUrl: url } : c))
  }

  // ── Event helpers ─────────────────────────────────────────────────────────

  function updateEvtField(field, value) {
    setEvents(prev => prev.map((e, i) => i === activeEvent ? { ...e, [field]: value } : e))
  }

  function updateEventCover(url) {
    setEvents(prev => prev.map((e, i) => i === activeEvent ? { ...e, coverImage: url } : e))
  }

  function updateSectionPhotos(photos) {
    setEvents(prev => prev.map((e, ei) => {
      if (ei !== activeEvent) return e
      return { ...e, sections: e.sections.map((s, si) => si === activeSection ? { ...s, photos } : s) }
    }))
  }

  function addEventSection(title) {
    setShowSectionPicker(false)
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

  async function addNewEvent() {
    const couple = prompt('Couple names (e.g. "Rahul & Priya"):')
    if (!couple) return
    const slug = couple.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
    const newEvt = { slug, couple, location: '', date: '', tagline: '', story: [], coverImage: '', sections: [], order: events.length }
    const created = await apiCreateEvent(newEvt)
    setEvents(prev => [...prev, created])
    setActiveEvent(events.length)
    setActiveSection(0)
  }

  async function deleteEvent(slug) {
    if (!confirm('Delete this event? This cannot be undone.')) return
    await apiDeleteEvent(slug)
    setEvents(prev => prev.filter(e => e.slug !== slug))
    setActiveEvent(0)
  }

  // ── Review helpers ────────────────────────────────────────────────────────

  function startEditReview(r) {
    setEditingReview(r.id)
    setReviewForm({ name: r.name, rating: r.rating, text: r.text })
  }

  function cancelEditReview() {
    setEditingReview(null)
    setReviewForm({ name: '', rating: 5, text: '' })
  }

  async function saveReview() {
    if (!reviewForm.name || !reviewForm.text) return
    if (editingReview) {
      const updated = await apiUpdateReview(editingReview, reviewForm)
      setReviews(prev => prev.map(r => r.id === editingReview ? updated : r))
    } else {
      const created = await apiCreateReview(reviewForm)
      setReviews(prev => [...prev, created])
    }
    cancelEditReview()
    showSaved()
  }

  async function deleteReview(id) {
    if (!confirm('Delete this review?')) return
    await apiDeleteReview(id)
    setReviews(prev => prev.filter(r => r.id !== id))
    showSaved()
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
            <ImageListEditor images={heroSlides} onChange={setHeroSlides} onRemove={async (updated) => { await apiSetConfig('heroSlides', updated); showSaved() }} label="Hero Slides (images + videos)" accept="image/*,video/*" />

            {/* ── Video via URL ── */}
            <div className="admin-video-url">
              <p className="admin-field__label" style={{ marginBottom: 8 }}>Add Video via URL (Cloudinary, etc.)</p>
              <div className="admin-video-url__row">
                <input
                  className="admin-field__input"
                  type="url"
                  placeholder="https://res.cloudinary.com/…/video.mp4"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addVideoUrl()}
                />
                <button className="admin-save-btn" style={{ marginTop: 0, whiteSpace: 'nowrap' }} onClick={addVideoUrl}>
                  + Add Video
                </button>
              </div>
              {videoUrlError && <p className="img-editor__warning">⚠️ {videoUrlError}</p>}
            </div>

            <button className="admin-save-btn" onClick={saveHero}>Save Hero Slides</button>
          </div>
        )}

        {/* ── Tab 1: Gallery Strip ── */}
        {tab === 1 && (
          <div className="admin-section">
            <h2 className="admin-section__title">Homepage Gallery Strip</h2>
            <p className="admin-section__desc">These images appear in the strip on the homepage.</p>
            <ImageListEditor images={strip} onChange={setStrip} onRemove={async (updated) => { await apiSetConfig('galleryStrip', updated); showSaved() }} label="Strip Images" />
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
                <div className="admin-field">
                  <label className="admin-field__label">YouTube Link</label>
                  <input
                    className="admin-field__input"
                    type="url"
                    placeholder="https://www.youtube.com/playlist?list=…"
                    value={cat.youtubeUrl || ''}
                    onChange={e => updateCatYoutube(e.target.value)}
                  />
                  <p style={{ color: '#666', fontSize: '0.75rem', marginTop: 4 }}>
                    Shown as a "Watch More on YouTube" button on the gallery page
                  </p>
                </div>
                <ImageListEditor
                  images={cat.photos}
                  onChange={updateCatPhotos}
                  onRemove={async (updated) => {
                    const cat = categories[activeCat]
                    await apiUpdateCategory(cat.slug, {
                      label: cat.label,
                      description: cat.description || '',
                      coverImage: cat.coverImage || '',
                      photos: photosToUrls(updated),
                      order: cat.order ?? activeCat,
                      youtubeUrl: cat.youtubeUrl || '',
                    })
                    showSaved()
                  }}
                  label="Gallery Photos"
                  enableFocalPoint
                />
                <button className="admin-save-btn" onClick={saveCat}>Save Category</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Events ── */}
        {tab === 3 && (
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
                <button className="admin-sidebar__add" onClick={addNewEvent}>+ Add Couple</button>
              </aside>

              {evt ? (
                <div className="admin-editor">
                  <div className="admin-field">
                    <label className="admin-field__label">Couple Names</label>
                    <input className="admin-field__input" value={evt.couple}
                      onChange={e => updateEvtField('couple', e.target.value)}
                      placeholder="e.g. Rahul & Priya" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Location / Venue</label>
                    <input className="admin-field__input" value={evt.location}
                      onChange={e => updateEvtField('location', e.target.value)}
                      placeholder="e.g. Hyderabad, Telangana" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Date</label>
                    <input className="admin-field__input" value={evt.date}
                      onChange={e => updateEvtField('date', e.target.value)}
                      placeholder="e.g. March, 2024" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Short Description (tagline)</label>
                    <textarea className="admin-field__input admin-field__textarea" value={evt.tagline}
                      onChange={e => updateEvtField('tagline', e.target.value)}
                      placeholder="A brief line about the wedding…" rows={2} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Cover Image</label>
                    <CoverUploader value={evt.coverImage} onChange={updateEventCover} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">YouTube Link</label>
                    <input
                      className="admin-field__input"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=… or playlist link"
                      value={evt.youtubeUrl || ''}
                      onChange={e => updateEvtField('youtubeUrl', e.target.value)}
                    />
                    <p style={{ color: '#666', fontSize: '0.75rem', marginTop: 4 }}>
                      Shown as a "Watch More on YouTube" button on the event page
                    </p>
                  </div>
                  <div className="admin-sections">
                    <div className="admin-sections__header">
                      <p className="admin-field__label">Photo Sections</p>
                      <div style={{ position: 'relative' }}>
                        <button className="admin-sections__add" onClick={() => setShowSectionPicker(p => !p)}>+ Add Section</button>
                        {showSectionPicker && (
                          <div className="section-picker">
                            {SECTION_OPTIONS.map(opt => (
                              <button key={opt} className="section-picker__opt" onClick={() => addEventSection(opt)}>{opt}</button>
                            ))}
                            <button className="section-picker__cancel" onClick={() => setShowSectionPicker(false)}>Cancel</button>
                          </div>
                        )}
                      </div>
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
                        onRemove={async (updated) => {
                          const currentEvt = events[activeEvent]
                          const updatedSections = currentEvt.sections.map((s, si) =>
                            si === activeSection ? { ...s, photos: updated } : s
                          )
                          await apiUpdateEvent(currentEvt.slug, {
                            couple: currentEvt.couple,
                            location: currentEvt.location,
                            date: currentEvt.date,
                            tagline: currentEvt.tagline,
                            story: currentEvt.story,
                            coverImage: currentEvt.coverImage,
                            sections: updatedSections.map(s => ({ ...s, photos: photosToUrls(s.photos) })),
                            order: currentEvt.order,
                            youtubeUrl: currentEvt.youtubeUrl || '',
                          })
                          showSaved()
                        }}
                        label={`Photos — ${evt.sections[activeSection].title}`}
                        enableFocalPoint
                      />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button className="admin-save-btn" onClick={saveEvt}>Save Event</button>
                    <button className="admin-save-btn" style={{ background: '#6b2222' }}
                      onClick={() => deleteEvent(evt.slug)}>Delete Event</button>
                  </div>
                </div>
              ) : (
                <div className="admin-editor">
                  <p style={{ color: '#888' }}>Click "+ Add Couple" to create your first event.</p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ── Tab 4: Reviews ── */}
        {tab === 4 && (
          <div className="admin-section">
            <h2 className="admin-section__title">Reviews</h2>
            <p className="admin-section__desc">Add, edit or delete reviews shown on the homepage.</p>

            {/* Form */}
            <div className="admin-review-form">
              <h3 className="admin-editor__name">{editingReview ? 'Edit Review' : 'Add New Review'}</h3>
              <div className="admin-field">
                <label className="admin-field__label">Name</label>
                <input
                  className="admin-field__input"
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Customer name"
                />
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Rating</label>
                <select
                  className="admin-field__input"
                  value={reviewForm.rating}
                  onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Review Text</label>
                <textarea
                  className="admin-field__input admin-field__textarea"
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="What did the customer say?"
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="admin-save-btn" onClick={saveReview}>
                  {editingReview ? 'Update Review' : 'Add Review'}
                </button>
                {editingReview && (
                  <button className="admin-save-btn" style={{ background: '#555' }} onClick={cancelEditReview}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="admin-review-list">
              {reviews.map(r => (
                <div key={r.id} className="admin-review-item">
                  <div className="admin-review-item__info">
                    <p className="admin-review-item__name">{r.name}</p>
                    <p className="admin-review-item__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                    <p className="admin-review-item__text">"{r.text}"</p>
                  </div>
                  <div className="admin-review-item__actions">
                    <button className="admin-sections__tab" onClick={() => startEditReview(r)}>Edit</button>
                    <button className="admin-sections__del" onClick={() => deleteReview(r.id)}>×</button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p style={{ color: '#888', fontSize: '0.85rem' }}>No reviews yet. Add one above.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
