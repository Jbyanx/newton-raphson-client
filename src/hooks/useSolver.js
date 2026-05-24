import { useState } from 'react'
import { solveSystem } from '../api/solverApi'

/** @typedef {{ eq1: string, eq2: string, var1: string, var2: string, guess1: string, guess2: string, maxIterations: string, tolerance: string }} FormData */

const MATH_EXPR_REGEX = /^[a-zA-Z0-9\s\+\-\*\^\/\.\(\)]+$/

/**
 * Validates the solver form data.
 * @param {FormData} formData
 * @returns {Record<string, string>} errors — empty object if all valid
 */
const sanitize = (str) => str
  .replace(/²/g, '^2')
  .replace(/³/g, '^3')
  .replace(/¹/g, '^1')
  .trim()

function validateForm(formData) {
  const { var1, var2, guess1, guess2, maxIterations, tolerance } = formData
  const eq1 = sanitize(formData.eq1)
  const eq2 = sanitize(formData.eq2)
  const errors = {}

  // ── Variables ──────────────────────────────────────────────
  const varNameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/

  if (!var1.trim()) {
    errors.var1 = 'Nombre de variable inválido. Use solo letras (ej: x, y)'
  } else if (!varNameRegex.test(var1.trim())) {
    errors.var1 = 'Nombre de variable inválido. Use solo letras (ej: x, y)'
  }

  if (!var2.trim()) {
    errors.var2 = 'Nombre de variable inválido. Use solo letras (ej: x, y)'
  } else if (!varNameRegex.test(var2.trim())) {
    errors.var2 = 'Nombre de variable inválido. Use solo letras (ej: x, y)'
  }

  if (var1.trim() && var2.trim() && var1.trim() === var2.trim()) {
    errors.var1 = 'Las variables deben ser diferentes entre sí'
    errors.var2 = 'Las variables deben ser diferentes entre sí'
  }

  // ── Equations ──────────────────────────────────────────────
  const v1 = var1.trim()
  const v2 = var2.trim()

  if (!eq1.trim()) {
    errors.eq1 = 'Solo se permiten expresiones matemáticas. Ejemplo válido: x^2 + y - 4'
  } else if (!MATH_EXPR_REGEX.test(eq1.trim())) {
    errors.eq1 = 'Solo se permiten expresiones matemáticas. Ejemplo válido: x^2 + y - 4'
  } else if (
    v1 && v2 &&
    !eq1.includes(v1) && !eq1.includes(v2)
  ) {
    errors.eq1 = 'La ecuación debe contener al menos una de las variables declaradas (ej: x, y)'
  }

  if (!eq2.trim()) {
    errors.eq2 = 'Solo se permiten expresiones matemáticas. Ejemplo válido: x^2 + y - 4'
  } else if (!MATH_EXPR_REGEX.test(eq2.trim())) {
    errors.eq2 = 'Solo se permiten expresiones matemáticas. Ejemplo válido: x^2 + y - 4'
  } else if (
    v1 && v2 &&
    !eq2.includes(v1) && !eq2.includes(v2)
  ) {
    errors.eq2 = 'La ecuación debe contener al menos una de las variables declaradas (ej: x, y)'
  }

  // ── Initial guesses ────────────────────────────────────────
  if (!isFinite(Number(guess1)) || guess1.trim() === '') {
    errors.guess1 = 'Debe ser un número válido (ej: 1.0, -2, 0)'
  }
  if (!isFinite(Number(guess2)) || guess2.trim() === '') {
    errors.guess2 = 'Debe ser un número válido (ej: 1.0, -2, 0)'
  }

  // ── Max iterations ─────────────────────────────────────────
  const maxIter = parseInt(maxIterations, 10)
  if (
    !Number.isInteger(maxIter) ||
    isNaN(maxIter) ||
    maxIter < 1 ||
    maxIter > 500 ||
    String(maxIter) !== String(maxIterations).trim()
  ) {
    errors.maxIterations = 'Debe ser un entero entre 1 y 500'
  }

  // ── Tolerance ──────────────────────────────────────────────
  const tol = parseFloat(tolerance)
  if (isNaN(tol) || tol <= 0 || tol >= 1) {
    errors.tolerance = 'Debe ser un número positivo menor a 1 (ej: 0.0000001)'
  }

  return errors
}

/**
 * Hook that manages all Newton-Raphson solver state and logic.
 * @returns {{ result: object|null, loading: boolean, error: string|null, validationErrors: Record<string,string>, solve: Function, clearResult: Function }}
 */
export function useSolver() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  /**
   * Validates and submits the solver form.
   * @param {FormData} formData
   */
  async function solve(formData) {
    const errors = validateForm(formData)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    setLoading(true)
    setError(null)
    setResult(null)

    const payload = {
      equations:      [sanitize(formData.eq1), sanitize(formData.eq2)],
      variables:      [formData.var1.trim(), formData.var2.trim()],
      initialGuess:   [Number(formData.guess1), Number(formData.guess2)],
      maxIterations:  parseInt(formData.maxIterations, 10),
      tolerance:      parseFloat(formData.tolerance),
    }

    try {
      const data = await solveSystem(payload)
      setResult(data)
    } catch (err) {
      if (err.response) {
        const msg =
          err.response.data?.message ||
          err.response.data?.error ||
          ''
        switch (err.response.status) {
          case 400:
            setError(`Error de validación: ${msg}`)
            break
          case 422:
            setError(`No se pudo resolver: ${msg}`)
            break
          case 500:
            setError('Error interno del servidor. Intenta de nuevo.')
            break
          default:
            setError('Error inesperado. Verifica tu conexión.')
        }
      } else {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.')
      }
    } finally {
      setLoading(false)
    }
  }

  /** Resets result, error and validationErrors to initial state. */
  function clearResult() {
    setResult(null)
    setError(null)
    setValidationErrors({})
  }

  return { result, loading, error, validationErrors, solve, clearResult }
}
