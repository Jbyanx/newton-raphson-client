import { CheckCircle } from 'lucide-react'

const STYLES = `
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
`
function injectStyles() {
  if (document.getElementById('iter-card-styles')) return
  const el = document.createElement('style')
  el.id = 'iter-card-styles'
  el.textContent = STYLES
  document.head.appendChild(el)
}

function errorBadgeStyle(error) {
  if (error > 1e-2) return { bg: 'var(--color-error-bg)', border: 'var(--color-error-border)', color: 'var(--color-error)' }
  if (error > 1e-5) return { bg: 'var(--color-warning-bg)', border: 'var(--color-warning)', color: 'var(--color-warning)' }
  return { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', color: 'var(--color-success)' }
}

const formatError = (error) => {
  if (error >= 1) return error.toFixed(4)
  if (error >= 1e-4) return error.toExponential(2)
  return error.toExponential(3)
}

function SubLabel({ children }) {
  return <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</p>
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-3) 0' }} />
}

function MonoValue({ children }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text)' }}>{children}</span>
}

function MonoLabel({ children }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{children}</span>
}

/**
 * Single Newton-Raphson iteration card.
 * @param {{ step: object, variables: string[], index: number, isLast: boolean }} props
 */
export default function IterationCard({ step, variables, index, isLast }) {
  injectStyles()

  const [var1, var2] = variables ?? ['x', 'y']
  const badge = errorBadgeStyle(step.error ?? 0)
  const J = step.jacobian ?? [[0,0],[0,0]]

  const cardStyle = {
    background: isLast ? 'var(--color-success-bg)' : 'var(--color-surface)',
    border: `1px solid ${isLast ? 'var(--color-success-border)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4) var(--space-5)',
    boxShadow: 'var(--shadow-sm)',
    opacity: 0,
    animation: 'slideInUp 350ms ease both',
    animationDelay: `${index * 60}ms`,
  }

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
          Iteración {step.iterationNumber}
        </span>
        <span style={{
          background: badge.bg,
          border: `1px solid ${badge.border}`,
          color: badge.color,
          borderRadius: '99px',
          padding: '2px 10px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
        }}>
          error = {formatError(step.error ?? 0)}
        </span>
      </div>

      {/* A — Current point */}
      <SubLabel>Punto actual</SubLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2) var(--space-4)' }}>
        <div>
          <MonoLabel>{var1} = </MonoLabel>
          <MonoValue>{(step.xValues?.[0] ?? 0).toFixed(8)}</MonoValue>
        </div>
        <div>
          <MonoLabel>{var2} = </MonoLabel>
          <MonoValue>{(step.xValues?.[1] ?? 0).toFixed(8)}</MonoValue>
        </div>
      </div>

      <Divider />

      {/* B — Jacobian */}
      <SubLabel>Matriz Jacobiana J(xₙ)</SubLabel>
      <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: 4 }}>
        {/* Left bracket */}
        <div style={{ width: 8, borderLeft: '2px solid var(--color-text-muted)', borderTop: '2px solid var(--color-text-muted)', borderBottom: '2px solid var(--color-text-muted)', borderRadius: '2px 0 0 2px' }} />
        {/* Matrix cells */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', padding: '8px 12px' }}>
          {[J[0][0], J[0][1], J[1][0], J[1][1]].map((v, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', textAlign: 'right', color: 'var(--color-text)' }}>
              {(v ?? 0).toFixed(6)}
            </span>
          ))}
        </div>
        {/* Right bracket */}
        <div style={{ width: 8, borderRight: '2px solid var(--color-text-muted)', borderTop: '2px solid var(--color-text-muted)', borderBottom: '2px solid var(--color-text-muted)', borderRadius: '0 2px 2px 0' }} />
      </div>

      <Divider />

      {/* C — Delta and next point */}
      <SubLabel>Corrección Δx y siguiente punto</SubLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1) var(--space-4)', marginBottom: 'var(--space-2)' }}>
        <div><MonoLabel>Δ{var1} = </MonoLabel><MonoValue>{(step.deltaX?.[0] ?? 0).toFixed(8)}</MonoValue></div>
        <div><MonoLabel>Δ{var2} = </MonoLabel><MonoValue>{(step.deltaX?.[1] ?? 0).toFixed(8)}</MonoValue></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1) var(--space-4)' }}>
        <div>
          <MonoLabel>{var1}₊₁ = </MonoLabel>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-primary)' }}>
            {(step.nextXValues?.[0] ?? 0).toFixed(8)}
          </span>
        </div>
        <div>
          <MonoLabel>{var2}₊₁ = </MonoLabel>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-primary)' }}>
            {(step.nextXValues?.[1] ?? 0).toFixed(8)}
          </span>
        </div>
      </div>

      {isLast && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-3)', color: 'var(--color-success)', fontSize: '0.82rem', fontWeight: 500 }}>
          <CheckCircle size={14} />
          Punto de convergencia alcanzado
        </div>
      )}
    </div>
  )
}
