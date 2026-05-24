import { useState } from 'react'

/**
 * Styled input field with label, hint, and error support.
 * @param {{ label: string, name: string, value: string, onChange: Function, error?: string, placeholder?: string, type?: string, hint?: string, readOnly?: boolean }} props
 */
export default function InputField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  hint,
  readOnly = false,
}) {
  const [focused, setFocused] = useState(false)

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
    width: '100%',
  }

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-subtle)',
    letterSpacing: '0.02em',
  }

  const hintStyle = {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '-2px',
  }

  const inputStyle = {
    width: '100%',
    minHeight: '44px',
    background: readOnly ? 'var(--color-surface)' : 'var(--color-surface-2)',
    border: `1.5px solid ${
      error
        ? 'var(--color-error)'
        : focused
        ? 'var(--color-primary)'
        : 'var(--color-border)'
    }`,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.95rem',
    padding: 'var(--space-3) var(--space-4)',
    outline: 'none',
    boxShadow: focused
      ? error
        ? '0 0 0 3px var(--color-error-glow)'
        : '0 0 0 3px var(--color-primary-glow)'
      : 'none',
    transition: 'var(--transition-fast)',
    opacity: readOnly ? 0.7 : 1,
    cursor: readOnly ? 'default' : 'text',
  }

  const errorStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-1)',
    fontSize: '0.8rem',
    color: 'var(--color-error)',
    lineHeight: 1.4,
  }

  return (
    <div style={wrapperStyle}>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>

      {hint && <span style={hintStyle}>{hint}</span>}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        spellCheck={false}
      />

      {error && (
        <span style={errorStyle} role="alert">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </span>
      )}
    </div>
  )
}
