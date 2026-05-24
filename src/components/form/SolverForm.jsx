import { useState } from 'react'
import InputField from '../ui/InputField'
import Button from '../ui/Button'

// ── Injected responsive styles ────────────────────────────────────────────────
const FORM_STYLES = `
  .sf-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }
  .sf-presets {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  @media (max-width: 480px) {
    .sf-two-col {
      grid-template-columns: 1fr;
    }
    .sf-presets {
      flex-direction: column;
    }
  }
`

function injectFormStyles() {
  if (document.getElementById('sf-styles')) return
  const el = document.createElement('style')
  el.id = 'sf-styles'
  el.textContent = FORM_STYLES
  document.head.appendChild(el)
}

// ── Presets ───────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: '📋 Ejemplo Lineal',
    data: {
      eq1: 'x + y - 4',
      eq2: 'x - y - 2',
      var1: 'x',
      var2: 'y',
      guess1: '0',
      guess2: '0',
      maxIterations: '100',
      tolerance: '1e-7',
    },
  },
  {
    label: '🔢 Ejemplo No Lineal',
    data: {
      eq1: 'x^2 + y - 4',
      eq2: 'x + y^2 - 6',
      var1: 'x',
      var2: 'y',
      guess1: '1',
      guess2: '1',
      maxIterations: '100',
      tolerance: '1e-7',
    },
  },
]

// ── Operator reference rows ───────────────────────────────────────────────────
const OPERATORS = [
  { op: 'x^2',    desc: 'potencia' },
  { op: 'x*y',    desc: 'multiplicación' },
  { op: '(x+1)',  desc: 'agrupación' },
  { op: 'sqrt(x)', desc: 'raíz cuadrada' },
  { op: 'sin(x)', desc: 'seno' },
  { op: 'cos(x)', desc: 'coseno' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ step, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
      <span style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '99px',
        background: 'var(--color-primary-glow)',
        color: 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        whiteSpace: 'nowrap',
        letterSpacing: '0.04em',
      }}>
        {step}
      </span>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
        {title}
      </h3>
    </div>
  )
}

function HintBox({ children }) {
  return (
    <div style={{
      background: 'var(--color-surface-2)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-3)',
      fontSize: '0.82rem',
      color: 'var(--color-text-muted)',
      lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}

function Divider() {
  return (
    <hr style={{
      border: 'none',
      borderTop: '1px solid var(--color-border)',
      margin: 'var(--space-6) 0',
    }} />
  )
}

function PresetButton({ label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 'var(--space-2) var(--space-4)',
        fontSize: '0.8rem',
        background: 'var(--color-surface-2)',
        border: `1px solid ${hovered ? 'var(--color-primary)' : 'var(--color-border)'}`,
        color: hovered ? 'var(--color-primary)' : 'var(--color-text-subtle)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        fontFamily: 'var(--font-sans)',
        minHeight: '36px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Primary Newton-Raphson solver form.
 * @param {{ onSolve: Function, loading: boolean, validationErrors: Record<string,string> }} props
 */
export default function SolverForm({ onSolve, loading, validationErrors }) {
  injectFormStyles()

  const [formData, setFormData] = useState({
    eq1: '',
    eq2: '',
    var1: 'x',
    var2: 'y',
    guess1: '1',
    guess2: '1',
    maxIterations: '100',
    tolerance: '1e-7',
  })

  const [advancedOpen, setAdvancedOpen] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function applyPreset(data) {
    setFormData(data)
  }

  function handleSubmit() {
    onSolve(formData)
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>

      {/* ── Presets ── */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
          Cargar ejemplo rápido:
        </p>
        <div className="sf-presets">
          {PRESETS.map(p => (
            <PresetButton key={p.label} label={p.label} onClick={() => applyPreset(p.data)} />
          ))}
        </div>
      </div>

      {/* ══ SECTION 1 — Variables ══ */}
      <SectionHeader step="Paso 1" title="Variables" />

      <div className="sf-two-col">
        <InputField
          label="Variable 1"
          name="var1"
          value={formData.var1}
          onChange={handleChange}
          placeholder="x"
          error={validationErrors?.var1}
        />
        <InputField
          label="Variable 2"
          name="var2"
          value={formData.var2}
          onChange={handleChange}
          placeholder="y"
          error={validationErrors?.var2}
        />
      </div>

      <HintBox>
        💡 Define los nombres de tus variables antes de escribir las ecuaciones. Ejemplo: x, y
      </HintBox>

      <Divider />

      {/* ══ SECTION 2 — Equations ══ */}
      <SectionHeader step="Paso 2" title="Ecuaciones" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <InputField
          label={`f₁(${formData.var1}, ${formData.var2}) = 0`}
          name="eq1"
          value={formData.eq1}
          onChange={handleChange}
          placeholder="x^2 + y - 4"
          hint="Escribe la expresión que igualada a 0 da tu ecuación. Operadores: + - * ^ / y paréntesis ( )"
          error={validationErrors?.eq1}
        />
        <InputField
          label={`f₂(${formData.var1}, ${formData.var2}) = 0`}
          name="eq2"
          value={formData.eq2}
          onChange={handleChange}
          placeholder="x + y^2 - 6"
          hint="Escribe la expresión que igualada a 0 da tu ecuación. Operadores: + - * ^ / y paréntesis ( )"
          error={validationErrors?.eq2}
        />
      </div>

      {/* Operator reference card */}
      <div style={{
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        marginTop: 'var(--space-2)',
      }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-subtle)', marginBottom: 'var(--space-3)' }}>
          📐 Referencia de operadores
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-2) var(--space-6)',
        }}>
          {OPERATORS.map(({ op, desc }) => (
            <div key={op} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <code style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-primary)',
                minWidth: '70px',
              }}>
                {op}
              </code>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ══ SECTION 3 — Initial Guess ══ */}
      <SectionHeader step="Paso 3" title="Punto Inicial" />

      <div className="sf-two-col">
        <InputField
          label={`${formData.var1}₀`}
          name="guess1"
          value={formData.guess1}
          onChange={handleChange}
          type="number"
          placeholder="1"
          error={validationErrors?.guess1}
        />
        <InputField
          label={`${formData.var2}₀`}
          name="guess2"
          value={formData.guess2}
          onChange={handleChange}
          type="number"
          placeholder="1"
          error={validationErrors?.guess2}
        />
      </div>

      <HintBox>
        ⚠️ El método de Newton-Raphson es sensible al punto inicial. Elige valores cercanos a la solución esperada para garantizar convergencia.
      </HintBox>

      <Divider />

      {/* ══ SECTION 4 — Advanced (collapsible) ══ */}
      <button
        type="button"
        onClick={() => setAdvancedOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-subtle)',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '0',
          fontFamily: 'var(--font-sans)',
          minHeight: '44px',
        }}
        aria-expanded={advancedOpen}
      >
        <span>⚙️ Parámetros avanzados</span>
        <span style={{
          fontSize: '0.7rem',
          transition: 'transform var(--transition-fast)',
          transform: advancedOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block',
        }}>
          ▾
        </span>
      </button>

      {advancedOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'var(--space-2)' }}>
          <div className="sf-two-col">
            <InputField
              label="Máx. Iteraciones"
              name="maxIterations"
              value={formData.maxIterations}
              onChange={handleChange}
              type="number"
              placeholder="100"
              error={validationErrors?.maxIterations}
            />
            <InputField
              label="Tolerancia"
              name="tolerance"
              value={formData.tolerance}
              onChange={handleChange}
              placeholder="1e-7"
              hint="Criterio de convergencia: max(|Δx|) < tolerancia"
              error={validationErrors?.tolerance}
            />
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <Button
          type="button"
          onClick={handleSubmit}
          loading={loading}
          variant="primary"
        >
          {loading ? 'Calculando...' : '▶ Resolver Sistema'}
        </Button>
      </div>

    </div>
  )
}
