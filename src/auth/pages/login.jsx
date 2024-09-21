import { useEffect } from 'react'
import { Link } from 'wouter'
import { supabase } from '../../db/supabase'
import { CardContainer } from '../components/card-container'
import { CardTitle } from '../components/card-title'
import { LoginForm } from '../components/login-form'
import { useLogin } from '../hooks/use-login'

export function Login() {
  const { error, errorMessage, loading, setError, setErrorMessage, setLoading } = useLogin()

  useEffect(() => {
    if (error == null) {
      return
    }
    if (error === 'invalid_credentials') {
      setErrorMessage('Credenciales incorrectas')
    } else {
      setErrorMessage('Ocurrió un error inesperado, intenta de nuevo más tarde.')
    }

    const timeout = setTimeout(() => {
      setErrorMessage(null)
      setError(null)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

  const handleSubmit = async (e) => {
    setError(null)
    setErrorMessage(null)
    setLoading(true)
    e.preventDefault()
    const form = new FormData(e.target)
    const email = form.get('user-email')
    const password = form.get('user-password')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.code)
    }
    setLoading(false)
  }

  return (
    <div className='background-gradient flex min-h-screen w-full flex-col items-center justify-center'>
      <CardContainer>
        <CardTitle
          title='¡Bienvenido de Nuevo!'
          subtitle='Inicia sesión con tu cuenta para acceder al sistema.'
        />
        <div className='mt-8'>
          <LoginForm
            errorMessage={errorMessage}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
        <p className='mt-4 text-center text-sm'>
          ¿No tienes una cuenta?{' '}
          <Link
            to='/register'
            className='text-purple-700'
          >
            Regístrate aquí.
          </Link>
        </p>
      </CardContainer>
    </div>
  )
}
