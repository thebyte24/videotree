/**
 * API client — all calls to the Express backend go through here.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getToken() {
  return sessionStorage.getItem('vt_token') || ''
}

async function request(method, path, body, isFormData = false) {
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin(password) {
  const data = await request('POST', '/api/auth/login', { password })
  sessionStorage.setItem('vt_token', data.token)
  return data
}

export function apiLogout() {
  sessionStorage.removeItem('vt_token')
}

export function isLoggedIn() {
  return !!sessionStorage.getItem('vt_token')
}

// ── Upload ───────────────────────────────────────────────────────────────────
export async function apiUploadImages(files) {
  const form = new FormData()
  Array.from(files).forEach((f) => form.append('images', f))
  return request('POST', '/api/upload', form, true)
}

export async function apiDeleteImage(filename) {
  return request('DELETE', '/api/upload', { filename })
}

// ── Galleries ────────────────────────────────────────────────────────────────
export async function apiGetCategories() {
  return request('GET', '/api/galleries')
}

export async function apiGetCategory(slug) {
  return request('GET', `/api/galleries/${slug}`)
}

export async function apiUpdateCategory(slug, data) {
  return request('PUT', `/api/galleries/${slug}`, data)
}

// ── Events ───────────────────────────────────────────────────────────────────
export async function apiGetEvents() {
  return request('GET', '/api/events')
}

export async function apiGetEvent(slug) {
  return request('GET', `/api/events/${slug}`)
}

export async function apiCreateEvent(data) {
  return request('POST', '/api/events', data)
}

export async function apiUpdateEvent(slug, data) {
  return request('PUT', `/api/events/${slug}`, data)
}

export async function apiDeleteEvent(slug) {
  return request('DELETE', `/api/events/${slug}`)
}

// ── Site Config (hero slides, gallery strip) ─────────────────────────────────
export async function apiGetConfig(key) {
  return request('GET', `/api/config/${key}`)
}

export async function apiSetConfig(key, value) {
  return request('PUT', `/api/config/${key}`, { value })
}
