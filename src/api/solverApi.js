import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/v1',
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
