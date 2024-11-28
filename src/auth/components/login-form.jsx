import { useEffect, useState } from 'react'
import { BiHide, BiShowAlt } from 'react-icons/bi'
import { useLocation } from 'wouter'
import { signIn } from '../../services/auth'
import { useLogin } from '../hooks/use-login'
import { Input } from '../../components/input'
import { Spinner } from 'flowbite-react'

export function LoginForm() {
  const { error, errorMessage, loading, setError, setErrorMessage, setLoading } = useLogin()
  const [, navigate] = useLocation()
  const [showPassword, setShowPassword] = useState(false)

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
    navigate('/home')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg bg-white p-6 shadow-md transition-all dark:bg-[#191c25] dark:shadow-lg'
    >
      <label className='flex flex-col gap-2'>
        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
          Correo electrónico
        </span>
        <Input
          required
          placeholder='micorreo@correo.com'
          name='user-email'
          type='email'
          className='dark:bg-[#1f1f2e] dark:text-gray-200'
        />
      </label>
      <label className='mt-4 flex flex-col gap-2'>
        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>Contraseña</span>
        <div className='relative'>
          <Input
            required
            placeholder='********'
            name='user-password'
            type={showPassword ? 'text' : 'password'}
            className='dark:bg-[#1f1f2e] dark:text-gray-200'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 px-3 text-sm text-purple-500 dark:text-purple-300'
          >
            {showPassword ? (
              <BiShowAlt
                size={22}
                color='grey'
              />
            ) : (
              <BiHide
                size={22}
                color='grey'
              />
            )}
          </button>
        </div>
      </label>
      <div>
        {errorMessage && (
          <p className='mt-2 text-sm text-red-500 dark:text-red-400'>{errorMessage}</p>
        )}
      </div>
      <button
        disabled={loading}
        type='submit'
        className='mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-purple-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60 dark:bg-purple-900 dark:hover:bg-purple-700'
      >
        {loading && (
          <Spinner
          />
        )}{' '}
        <span>Iniciar sesión</span>
      </button>
    </form>
  )
}
