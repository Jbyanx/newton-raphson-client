import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Solves a system of nonlinear equations using the Newton-Raphson method.
 * @param {{ equations: string[], variables: string[], initialGuess: number[], maxIterations: number, tolerance: number }} payload
 * @returns {Promise<any>} API response data
 */
export async function solveSystem(payload) {
  try {
    const response = await apiClient.post('/solve', payload)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Checks the health/status of the Newton-Raphson API.
 * @returns {Promise<any>} API response data
 */
export async function checkHealth() {
  const response = await apiClient.get('/health')
  return response.data
}
