import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Spinner } from '../../components/Spinner'
import { signIn } from '../../services/auth'
import { useLogin } from '../hooks/use-login'

export function LoginForm() {
  const { error, errorMessage, loading, setError, setErrorMessage, setLoading } = useLogin()
  const [, navigate] = useLocation()

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

    return () => {
      clearTimeout(timeout)
    }
  }, [error])

  const handleSubmit = async (e) => {
    setError(null)
    setErrorMessage(null)
    setLoading(true)
    e.preventDefault()
    const form = new FormData(e.target)
    const email = form.get('user-email')
    const password = form.get('user-password')

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.code)
      setLoading(false)
      return
    }
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className='flex flex-col gap-2'>
        <span className='text-sm font-semibold'>Correo electrónico</span>
        <input
          required
          placeholder='micorreo@correo.com'
          name='user-email'
          type='email'
          className='rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-800 placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
        />
      </label>
      <label className='mt-4 flex flex-col gap-2'>
        <span className='text-sm font-semibold'>Contraseña</span>
        <input
          required
          placeholder='********'
          name='user-password'
          type='password'
          className='rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-800 placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
        />
      </label>
      <div>{errorMessage && <p className='mt-2 text-sm text-red-500'>{errorMessage}</p>}</div>
      <button
        disabled={loading}
        type='submit'
        className='mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-purple-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60'
      >
        {loading && <Spinner />} <span>Iniciar sesión</span>
      </button>
    </form>
  )
}
