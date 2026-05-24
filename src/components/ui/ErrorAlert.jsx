import { XCircle } from 'lucide-react'

/**
 * Red alert box for API-level errors.
 * @param {{ message: string }} props
 */
export default function ErrorAlert({ message }) {
  return (
    <div role="alert" aria-live="assertive" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      background: 'var(--color-error-bg)',
      border: '1px solid var(--color-error-border)',
      borderLeft: '4px solid var(--color-error)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      width: '100%',
    }}>
      <XCircle size={16} color="var(--color-error)" style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ fontSize: '0.9rem', color: 'var(--color-error)', lineHeight: 1.5 }}>
        {message}
      </p>
    </div>
  )
}
