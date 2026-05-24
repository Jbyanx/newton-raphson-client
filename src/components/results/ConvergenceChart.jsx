import { useRef, useState, useEffect } from 'react'
import { TrendingDown } from 'lucide-react'

function toSup(n) {
  const map = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' }
  return '10' + String(Math.round(n)).split('').map(c => map[c] ?? c).join('')
}

/**
 * Pure SVG line chart showing log10(error) per iteration.
 * @param {{ steps: Array<{error: number, iterationNumber: number}> }} props
 */
export default function ConvergenceChart({ steps }) {
  const containerRef = useRef(null)
  const [svgWidth, setSvgWidth] = useState(500)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setSvgWidth(Math.floor(e.contentRect.width))
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const H = 160
  const PAD = { top: 12, right: 16, bottom: 30, left: 52 }
  const chartW = svgWidth - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const valid = (steps ?? []).filter(s => s.error > 0)

  if (valid.length < 2) {
    return (
      <div ref={containerRef} style={{ width: '100%', height: `${H}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          No hay suficientes iteraciones para graficar
        </span>
      </div>
    )
  }

  const logErrors = valid.map(s => Math.log10(s.error))
  const minLog = Math.min(...logErrors)
  const maxLog = Math.max(...logErrors)
  const logRange = maxLog - minLog || 1

  const pts = valid.map((s, i) => [
    PAD.left + (i / (valid.length - 1)) * chartW,
    PAD.top + (1 - (Math.log10(s.error) - minLog) / logRange) * chartH,
  ])

  const polyPoints = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const areaPath = [
    `M ${pts[0][0]},${pts[0][1]}`,
    ...pts.slice(1).map(([x, y]) => `L ${x},${y}`),
    `L ${pts[pts.length - 1][0]},${PAD.top + chartH}`,
    `L ${pts[0][0]},${PAD.top + chartH}`,
    'Z',
  ].join(' ')

  const yTicks = [0, 0.5, 1].map(t => ({
    y: PAD.top + (1 - t) * chartH,
    label: toSup(minLog + t * logRange),
  }))

  const xCount = Math.min(valid.length, 6)
  const xTicks = Array.from({ length: xCount }, (_, i) => {
    const idx = Math.round(i * (valid.length - 1) / (xCount - 1))
    return { x: PAD.left + (idx / (valid.length - 1)) * chartW, label: String(valid[idx].iterationNumber ?? idx + 1) }
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
        <TrendingDown size={14} />
        <span>Convergencia del Error</span>
      </div>
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg width={svgWidth} height={H} style={{ display: 'block', overflow: 'visible' }}>
          {/* Grid lines */}
          {yTicks.map(({ y }, i) => (
            <line key={i} x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
              stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 3" />
          ))}
          {/* X axis */}
          <line x1={PAD.left} y1={PAD.top + chartH} x2={PAD.left + chartW} y2={PAD.top + chartH}
            stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Area fill */}
          <path d={areaPath} fill="var(--color-primary-glow)" />
          {/* Line */}
          <polyline points={polyPoints} fill="none" stroke="var(--color-primary)"
            strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {/* Dots */}
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4}
              fill={i === pts.length - 1 ? 'var(--color-primary)' : 'white'}
              stroke="var(--color-primary)" strokeWidth="2" />
          ))}
          {/* Y labels */}
          {yTicks.map(({ y, label }, i) => (
            <text key={i} x={PAD.left - 6} y={y + 4} textAnchor="end"
              fontSize="10" fill="var(--color-text-muted)" fontFamily="var(--font-mono)">
              {label}
            </text>
          ))}
          {/* X labels */}
          {xTicks.map(({ x, label }, i) => (
            <text key={i} x={x} y={H - 6} textAnchor="middle"
              fontSize="10" fill="var(--color-text-muted)" fontFamily="var(--font-mono)">
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
