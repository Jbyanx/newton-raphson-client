/**
 * Surface card container with optional title and subtitle.
 * @param {{ children: React.ReactNode, title?: string, subtitle?: string, style?: React.CSSProperties }} props
 */
export default function Card({ children, title, subtitle, style }) {
  const cardStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow-md)',
    width: '100%',
    ...style,
  }

  const headerStyle = {
    marginBottom: 'var(--space-5)',
    paddingBottom: 'var(--space-4)',
    borderBottom: '1px solid var(--color-border)',
  }

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    lineHeight: 1.3,
  }

  const subtitleStyle = {
    fontSize: '0.85rem',
    color: 'var(--color-text-muted)',
    marginTop: 'var(--space-1)',
    lineHeight: 1.5,
  }

  return (
    <div style={cardStyle}>
      {title && (
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
