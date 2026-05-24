/**
 * Surface card container.
 * @param {{ children: React.ReactNode, title?: React.ReactNode, subtitle?: string, style?: React.CSSProperties }} props
 */
export default function Card({ children, title, subtitle, style }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-sm)',
      width: '100%',
      ...style,
    }}>
      {title && (
        <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
