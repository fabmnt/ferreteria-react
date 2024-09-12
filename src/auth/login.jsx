import { Link, Redirect } from 'wouter'
import { supabase } from '../db/supabase'
import { useSession } from '../hooks/useSession'
import { useEffect, useState } from 'react'
import { Spinner } from '../components/Spinner'

export function Login() {
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
    return <Redirect to='/' />
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
    <div className='background-gradient flex min-h-screen w-full flex-col items-center justify-center'>
      <section className='mx-auto w-[520px] rounded-lg border bg-white px-8 py-10 shadow-xl'>
        <div className='text-center'>
          <h1 className='text-2xl font-semibold'>¡Bienvenido de Nuevo!</h1>
          <p className='mt-1 text-sm text-zinc-600'>
            Inicia sesión con tu cuenta para acceder al sistema.
          </p>
        </div>
        <form
          className='mt-8'
          onSubmit={handleSubmit}
        >
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

          <p className='mt-4 text-center text-sm'>
            ¿No tienes una cuenta?{' '}
            <Link
              to='/register'
              className='text-purple-700'
            >
              Regístrate aquí.
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}
