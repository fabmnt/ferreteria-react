import { Link, Redirect } from 'wouter'
import { supabase } from '../db/supabase'
import { useSession } from '../hooks/useSession'
import { useEffect, useState } from 'react'
import { Spinner } from '../components/Spinner'

export function Login () {
  const { session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (error == null) {
      return
    }

    if (error === 'invalid_credentials') {
      setErrorMessage('Credenciales incorrectas')
    } else {
      setErrorMessage('Ocurrió un error inesperado')
    }

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }, [error])

  if (session) {
    return (
      <Redirect to='/' />
    )
  }

  const handleSubmit = async (e) => {
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
    <div className='w-full background-gradient min-h-screen flex flex-col items-center justify-center'>
      <section className='rounded-lg shadow-xl bg-white px-8 py-10 w-[520px] mx-auto border'>
        <div className='text-center'>
          <h1 className='font-semibold text-2xl'>¡Bienvenido de Nuevo!</h1>
          <p className='text-zinc-600 text-sm mt-1'>
            Inicia sesión con tu cuenta para acceder al sistema.
          </p>
        </div>
        <form className='mt-8' onSubmit={handleSubmit}>
          <label className='flex flex-col gap-2'>
            <span className='text-sm font-semibold'>Correo electrónico</span>
            <input
              required
              placeholder='micorreo@correo.com'
              name='user-email'
              type='email'
              className='placeholder:text-sm text-zinc-800 px-2 py-1.5 border rounded-md border-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
            />
          </label>
          <label className='flex flex-col gap-2 mt-4'>
            <span className='text-sm font-semibold'>Contraseña</span>
            <input
              required
              placeholder='********'
              name='user-password'
              type='password'
              className='placeholder:text-sm text-zinc-800 px-2 py-1.5 border rounded-md border-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
            />
          </label>
          <div>
            {errorMessage && (
              <p className='text-red-500 text-sm mt-2'>
                {errorMessage}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='mt-8 w-full flex gap-2 justify-center items-center bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors text-sm'
          >
            {loading && <Spinner />} <span>Iniciar sesión</span>
          </button>

          <p className='text-sm text-center mt-4'>
            ¿No tienes una cuenta?{' '}
            <Link to='/register' className='text-purple-700'>
              Regístrate aquí.
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}
