const variantStyles = {
  success: {
    background: 'var(--color-success-glow)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success)',
  },
  error: {
    background: 'var(--color-error-glow)',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error)',
  },
  default: {
    background: 'var(--color-primary-glow)',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
  },
}

/**
 * Small pill badge for status indicators.
 * @param {{ children: React.ReactNode, variant?: 'success'|'error'|'default' }} props
 */
export default function Badge({ children, variant = 'default' }) {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.6,
    whiteSpace: 'nowrap',
    ...(variantStyles[variant] ?? variantStyles.default),
  }

  return <span style={style}>{children}</span>
}
