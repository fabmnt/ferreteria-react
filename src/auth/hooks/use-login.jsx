import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { useSessionStore } from '../../store/session'

export function useLogin() {
  const session = useSessionStore((state) => state.session)
  const [, navigate] = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (session) {
      navigate('/')
    }
  }, [session])

  return { loading, error, errorMessage, setLoading, setError, setErrorMessage }
}
