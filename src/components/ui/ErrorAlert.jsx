/**
 * Alert box displayed when the API returns an error.
 * @param {{ message: string }} props
 */
export default function ErrorAlert({ message }) {
  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    background: 'var(--color-error-glow)',
    border: '1px solid var(--color-error)',
    borderLeft: '4px solid var(--color-error)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    width: '100%',
  }

  const iconStyle = {
    fontSize: '1rem',
    flexShrink: 0,
    lineHeight: 1.5,
  }

  const textStyle = {
    fontSize: '0.9rem',
    color: 'var(--color-error)',
    lineHeight: 1.5,
  }

  return (
    <div style={containerStyle} role="alert" aria-live="assertive">
      <span style={iconStyle} aria-hidden="true">❌</span>
      <p style={textStyle}>{message}</p>
    </div>
  )
}
