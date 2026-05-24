import { useRef, useEffect } from 'react'

const SPINNER_KEYFRAMES = `
@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
`

function injectSpinnerStyles() {
  if (document.getElementById('btn-spinner-styles')) return
  const style = document.createElement('style')
  style.id = 'btn-spinner-styles'
  style.textContent = SPINNER_KEYFRAMES
  document.head.appendChild(style)
}

const variantStyles = {
  primary: {
    background: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-text-subtle)',
    border: '1px solid var(--color-border)',
  },
  danger: {
    background: 'var(--color-error)',
    color: '#ffffff',
    border: 'none',
  },
}

/**
 * Reusable button component.
 * @param {{ children: React.ReactNode, onClick?: Function, disabled?: boolean, loading?: boolean, variant?: 'primary'|'secondary'|'danger', type?: string }} props
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  type = 'button',
}) {
  const isDisabled = disabled || loading
  const injected = useRef(false)

  useEffect(() => {
    if (!injected.current) {
      injectSpinnerStyles()
      injected.current = true
    }
  }, [])

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    width: '100%',
    minHeight: '48px',
    padding: 'var(--space-4) var(--space-6)',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'var(--transition-base)',
    outline: 'none',
    ...variantStyles[variant],
  }

  function handleMouseEnter(e) {
    if (isDisabled) return
    e.currentTarget.style.filter = 'brightness(1.1)'
    e.currentTarget.style.transform = 'translateY(-1px)'
  }

  function handleMouseLeave(e) {
    e.currentTarget.style.filter = ''
    e.currentTarget.style.transform = ''
  }

  function handleMouseDown(e) {
    if (isDisabled) return
    e.currentTarget.style.transform = 'translateY(0)'
  }

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {loading && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'btn-spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  )
}
