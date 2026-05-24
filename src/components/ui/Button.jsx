import { useRef, useEffect } from 'react'

const SPINNER_CSS = `@keyframes btn-spin { to { transform: rotate(360deg); } }`
function injectSpinner() {
  if (document.getElementById('btn-spinner-styles')) return
  const el = document.createElement('style')
  el.id = 'btn-spinner-styles'
  el.textContent = SPINNER_CSS
  document.head.appendChild(el)
}

const BASE = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 'var(--space-2)', width: '100%', minHeight: '48px',
  padding: 'var(--space-4) var(--space-6)',
  borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 600,
  fontFamily: 'var(--font-sans)', outline: 'none', cursor: 'pointer',
  transition: 'var(--transition-base)', border: 'none',
}

const VARIANTS = {
  primary: {
    normal: { background: 'var(--color-primary)', color: '#fff', boxShadow: 'var(--shadow-sm)' },
    hover:  { background: 'var(--color-primary-dark)', boxShadow: 'var(--shadow-primary)', transform: 'translateY(-1px)' },
  },
  secondary: {
    normal: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' },
    hover:  { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', transform: 'translateY(-1px)' },
  },
  danger: {
    normal: { background: 'var(--color-error)', color: '#fff', boxShadow: 'var(--shadow-sm)' },
    hover:  { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
  },
}

/**
 * @param {{ children: React.ReactNode, onClick?: Function, disabled?: boolean, loading?: boolean, variant?: 'primary'|'secondary'|'danger', type?: string }} props
 */
export default function Button({ children, onClick, disabled = false, loading = false, variant = 'primary', type = 'button' }) {
  const injected = useRef(false)
  useEffect(() => { if (!injected.current) { injectSpinner(); injected.current = true } }, [])

  const isDisabled = disabled || loading
  const v = VARIANTS[variant] ?? VARIANTS.primary

  function onEnter(e) {
    if (isDisabled) return
    Object.assign(e.currentTarget.style, v.hover)
  }
  function onLeave(e) {
    Object.assign(e.currentTarget.style, { background: v.normal.background ?? '', boxShadow: v.normal.boxShadow ?? 'none', transform: '', filter: '', borderColor: v.normal.border ? v.normal.border.replace('1px solid ', '') : '', color: v.normal.color ?? '' })
  }
  function onDown(e) { if (!isDisabled) e.currentTarget.style.transform = 'translateY(0)' }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      style={{ ...BASE, ...v.normal, opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
    >
      {loading && (
        <span aria-hidden style={{
          display: 'inline-block', width: 16, height: 16,
          border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
          borderRadius: '50%', animation: 'btn-spin 0.7s linear infinite', flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  )
}
