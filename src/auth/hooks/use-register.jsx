import { useState } from 'react'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  return { loading, error, errorMessage, setLoading, setError, setErrorMessage }
}
