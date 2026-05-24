import { useState } from 'react'
import { CheckCircle, AlertTriangle, TrendingDown, RotateCcw, Printer } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ConvergenceChart from './ConvergenceChart'
import IterationCard from './IterationCard'

const FADE_CSS = `@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`
function injectFade() {
  if (document.getElementById('results-panel-styles')) return
  const el = document.createElement('style')
  el.id = 'results-panel-styles'
  el.textContent = FADE_CSS
  document.head.appendChild(el)
}

/**
 * Full results view after a successful API solve.
 * @param {{ result: object, variables: string[], onClear: Function }} props
 */
export default function ResultsPanel({ result, variables, onClear }) {
  injectFade()
  const [showAll, setShowAll] = useState(false)

  const vars = variables ?? ['x', 'y']
  const [var1, var2] = vars
  const steps = result.steps ?? []
  const converged = result.converged
  const visibleSteps = showAll ? steps : steps.slice(0, 3)

  // ── Section 1: Summary ──────────────────────────────────────────────────────
  const summaryStyle = {
    background: converged ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
    border: `1px solid ${converged ? 'var(--color-success-border)' : 'var(--color-warning)'}`,
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow-sm)',
    animation: 'fadeIn 400ms ease both',
  }

  const sol = result.solution ?? {}
  const finalError = result.finalError ?? 0
  const totalIter = result.totalIterations ?? steps.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

      {/* Summary card */}
      <div style={summaryStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            {converged
              ? <CheckCircle size={24} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              : <AlertTriangle size={24} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            }
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {converged ? 'Sistema resuelto' : 'No convergió'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {converged
                  ? `Solución encontrada en ${totalIter} iteraciones`
                  : `Se alcanzó el límite de ${totalIter} iteraciones`}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>Error final</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {finalError.toExponential(3)}
            </p>
          </div>
        </div>

        {/* Solution box */}
        {converged && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-success-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginTop: 'var(--space-4)',
          }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Solución</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {[var1, var2].map(v => (
                <div key={v}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {v} = {(sol[v] ?? 0).toFixed(8)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Convergence chart */}
      <Card title={<><TrendingDown size={16} />Gráfico de Convergencia</>}
            subtitle="Error por iteración en escala logarítmica">
        <ConvergenceChart steps={steps} />
      </Card>

      {/* Section 3: Iterations */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Desglose de Iteraciones</span>
            <button
              onClick={() => setShowAll(p => !p)}
              style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'var(--font-sans)' }}
            >
              {showAll ? 'Colapsar' : 'Mostrar todo'}
            </button>
          </div>
        }
        subtitle={`${steps.length} pasos · tolerancia alcanzada`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {visibleSteps.map((step, i) => (
            <IterationCard
              key={step.iterationNumber ?? i}
              step={step}
              variables={vars}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
          {!showAll && steps.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              style={{ fontSize: '0.85rem', color: 'var(--color-primary)', background: 'none', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', cursor: 'pointer', fontWeight: 500 }}
            >
              Ver {steps.length - 3} iteraciones más…
            </button>
          )}
        </div>
      </Card>

      {/* Section 4: Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <Button variant="secondary" onClick={onClear}>
          <RotateCcw size={16} />
          Nuevo cálculo
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          <Printer size={16} />
          Imprimir
        </Button>
      </div>

    </div>
  )
}
