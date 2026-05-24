import { useEffect, useState } from 'react'
import { useSolver } from './hooks/useSolver'
import { checkHealth } from './api/solverApi'
import SolverForm from './components/form/SolverForm'
import Card from './components/ui/Card'
import ErrorAlert from './components/ui/ErrorAlert'

// ── Health pulse animation ────────────────────────────────────────────────────
const APP_STYLES = `
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  .health-dot-pulse {
    animation: pulse-dot 1.5s ease-in-out infinite;
  }
`

function injectAppStyles() {
  if (document.getElementById('app-styles')) return
  const el = document.createElement('style')
  el.id = 'app-styles'
  el.textContent = APP_STYLES
  document.head.appendChild(el)
}

// ── Health indicator ──────────────────────────────────────────────────────────
function HealthIndicator() {
  const [status, setStatus] = useState('checking') // 'checking' | 'up' | 'down'

  useEffect(() => {
    checkHealth()
      .then(() => setStatus('up'))
      .catch(() => setStatus('down'))
  }, [])

  const config = {
    checking: { color: 'var(--color-text-muted)', label: 'Verificando...', pulse: true },
    up:       { color: 'var(--color-success)',    label: 'API activa',     pulse: false },
    down:     { color: 'var(--color-error)',      label: 'API inactiva',   pulse: false },
  }[status]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span
        className={config.pulse ? 'health-dot-pulse' : ''}
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: '0.75rem', color: config.color, fontWeight: 500, whiteSpace: 'nowrap' }}>
        {config.label}
      </span>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  injectAppStyles()

  const { result, loading, error, validationErrors, solve } = useSolver()

  return (
    <>
      {/* ── Header ── */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        gap: 'var(--space-4)',
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          lineHeight: 1,
          flexShrink: 0,
        }}>
          ∇
        </span>

        {/* Title block */}
        <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            Newton-Raphson Solver
          </h1>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            marginTop: '2px',
          }}>
            Sistemas 2×2 · Paso a paso
          </p>
        </div>

        {/* Health indicator */}
        <div style={{ flexShrink: 0 }}>
          <HealthIndicator />
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4)',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}>
        <Card
          title="Configurar Sistema"
          subtitle="Ingresa tus ecuaciones y parámetros"
        >
          <SolverForm
            onSolve={solve}
            loading={loading}
            validationErrors={validationErrors}
          />
        </Card>

        {error && <ErrorAlert message={error} />}

        {/* Results placeholder — filled in next prompt */}
        {result && <div id="results-placeholder" />}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        padding: 'var(--space-6)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.75rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        Newton-Raphson Solver · Universidad del Magdalena · Análisis Numérico
      </footer>
    </>
  )
}
