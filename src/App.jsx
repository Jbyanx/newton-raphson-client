import { useEffect, useState } from 'react'
import { useSolver } from './hooks/useSolver'
import { checkHealth } from './api/solverApi'
import SolverForm from './components/form/SolverForm'
import ResultsPanel from './components/results/ResultsPanel'
import Card from './components/ui/Card'
import ErrorAlert from './components/ui/ErrorAlert'

const APP_STYLES = `
  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .health-pulse { animation: pulse-dot 1.5s ease-in-out infinite; }
`
function injectAppStyles() {
  if (document.getElementById('app-styles')) return
  const el = document.createElement('style')
  el.id = 'app-styles'
  el.textContent = APP_STYLES
  document.head.appendChild(el)
}

function HealthIndicator() {
  const [status, setStatus] = useState('checking')
  useEffect(() => {
    checkHealth().then(() => setStatus('up')).catch(() => setStatus('down'))
  }, [])

  const cfg = {
    checking: { color: 'var(--color-text-subtle)', label: 'Verificando...', pulse: true },
    up:       { color: 'var(--color-success)',     label: 'API activa',     pulse: false },
    down:     { color: 'var(--color-error)',       label: 'API inactiva',   pulse: false },
  }[status]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span className={cfg.pulse ? 'health-pulse' : ''} style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      <span style={{ fontSize: '0.75rem', color: cfg.color, fontWeight: 500, whiteSpace: 'nowrap' }}>{cfg.label}</span>
    </div>
  )
}

export default function App() {
  injectAppStyles()
  const { result, loading, error, validationErrors, solve, clearResult } = useSolver()

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [result])

  return (
    <>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        gap: 'var(--space-4)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1, flexShrink: 0 }}>∇</span>

        <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Newton-Raphson Solver
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Sistemas 2×2 · Paso a paso
          </p>
        </div>

        <div style={{ flexShrink: 0 }}><HealthIndicator /></div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 'var(--space-6) var(--space-4)', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Card title="Configurar Sistema" subtitle="Ingresa tus ecuaciones y parámetros">
          <SolverForm onSolve={solve} loading={loading} validationErrors={validationErrors} />
        </Card>

        {error && <ErrorAlert message={error} />}

        {result && (
          <div id="results-section">
            <ResultsPanel result={result} variables={result.variables ?? ['x', 'y']} onClear={clearResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
        Newton-Raphson Solver · Universidad del Magdalena · Análisis Numérico
      </footer>
    </>
  )
}
