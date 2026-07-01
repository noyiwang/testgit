import { useState, useEffect } from 'react'
import { mockData } from '../services/api'

export function useData(fetcher, fallbackKey, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        let result = null
        if (fetcher) {
          result = await fetcher()
        }
        if (!result && fallbackKey && mockData[fallbackKey]) {
          result = mockData[fallbackKey]
        }
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message)
          if (fallbackKey && mockData[fallbackKey]) {
            setData(mockData[fallbackKey])
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => { mounted = false }
  }, deps)

  return { data, loading, error }
}
