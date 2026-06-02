import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production you'd send this to a logging service (Sentry, etc.)
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f0ece4',
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          textAlign: 'center',
          padding: '40px 20px',
        }}>
          <p style={{ color: '#c9a96e', letterSpacing: '3px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px' }}>
            Something went wrong
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 400, margin: '0 0 16px' }}>
            We hit an unexpected error
          </h1>
          <p style={{ color: '#888', fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.7, marginBottom: '32px' }}>
            Please refresh the page. If the problem persists, reach out to us directly.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#c9a96e',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 28px',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
