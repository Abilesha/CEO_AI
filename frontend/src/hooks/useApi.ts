/**
 * useApi.ts
 * ---------
 * Custom React hook for making API calls with built-in
 * loading, error, and data state management.
 *
 * Usage:
 *   const { data, isLoading, error, execute } = useApi<User[]>()
 *   await execute(() => api.get('/users'))
 */

import { useState, useCallback, useRef } from 'react'
import type { ApiResponse } from '@services/api'

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  status: number | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (apiCall: () => Promise<ApiResponse<T>>) => Promise<ApiResponse<T>>
  reset: () => void
}

const initialState = <T>(): UseApiState<T> => ({
  data: null,
  isLoading: false,
  error: null,
  status: null,
})

/**
 * useApi — generic hook for API request state management
 * @param immediate - optional callback to run immediately on mount
 */
export function useApi<T = unknown>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>(initialState<T>())
  const isMountedRef = useRef(true)

  // Track mounted state to prevent setting state on unmounted components
  useState(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  })

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> => {
      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))
      }

      const response = await apiCall()

      if (isMountedRef.current) {
        setState({
          data: response.data,
          isLoading: false,
          error: response.error,
          status: response.status,
        })
      }

      return response
    },
    [],
  )

  const reset = useCallback(() => {
    setState(initialState<T>())
  }, [])

  return { ...state, execute, reset }
}

export default useApi
