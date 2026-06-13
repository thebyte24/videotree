import { useState, useRef, useCallback } from 'react'
import './FocalPointEditor.css'

/**
 * FocalPointEditor
 * Shows the photo with the target aspect ratio.
 * Admin clicks/drags to set the focal point (x%, y%).
 * onSave({ url, x, y }) called when done.
 */
export default function FocalPointEditor({ photo, aspectRatio = '3/2', onSave, onClose }) {
  const { url, x: initX = 50, y: initY = 50 } = photo
  const [pos, setPos] = useState({ x: initX, y: initY })
  const imgRef = useRef(null)

  const updateFromEvent = useCallback((clientX, clientY) => {
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
    const y = Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)))
    setPos({ x, y })
  }, [])

  function onMouseDown(e) {
    e.preventDefault()
    updateFromEvent(e.clientX, e.clientY)
    function onMove(ev) { updateFromEvent(ev.clientX, ev.clientY) }
    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function onTouchStart(e) {
    updateFromEvent(e.touches[0].clientX, e.touches[0].clientY)
  }
  function onTouchMove(e) {
    e.preventDefault()
    updateFromEvent(e.touches[0].clientX, e.touches[0].clientY)
  }

  return (
    <div className="fpe-overlay" onClick={onClose}>
      <div className="fpe" onClick={e => e.stopPropagation()}>
        <div className="fpe__header">
          <span>Drag to set focal point</span>
          <button className="fpe__close" onClick={onClose}>✕</button>
        </div>

        <div
          className="fpe__frame"
          style={{ aspectRatio }}
          ref={imgRef}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          <img
            src={url}
            alt=""
            className="fpe__img"
            style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
            draggable={false}
          />
          {/* Focal point crosshair */}
          <div
            className="fpe__dot"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          />
          <div className="fpe__hint">Click or drag to move focal point</div>
        </div>

        <div className="fpe__footer">
          <span className="fpe__coords">Focal: {pos.x}%, {pos.y}%</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="fpe__cancel" onClick={onClose}>Cancel</button>
            <button className="fpe__save" onClick={() => { onSave({ ...photo, x: pos.x, y: pos.y }); onClose() }}>
              Save Position
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
