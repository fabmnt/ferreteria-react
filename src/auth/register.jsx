import { Link, useLocation } from 'wouter'
import { supabase } from '../db/supabase'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '../components/Spinner'

export function Register() {
  const [loading, setLoading] = useState(false)
  const [, setLocation] = useLocation()
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (error == null) {
      return
    }

    if (error === 'user_already_exists') {
      setErrorMessage('El correo electrónico ya está registrado.')
    } else if (error === 'weak_password') {
      setErrorMessage('La contraseña es muy débil.')
    } else {
      setErrorMessage('Ocurrió un error inesperado, intenta de nuevo más tarde.')
    }

    const timeout = setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [error])

  const handleSubmit = useCallback(async (e) => {
    setLoading(true)
    e.preventDefault()
    const form = new FormData(e.target)
    const email = form.get('user-email')
    const password = form.get('user-password')
    const name = form.get('user-name')
    const lastname = form.get('user-lastname')
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.code)
      setLoading(false)
      return
    }
    const newEmployee = { user_id: data.user.id, name, last_name: lastname, role_id: 3 }
    const { error: insertError } = await supabase.from('employees').insert([newEmployee])

    if (insertError) {
      setError(error.code)
      setLoading(false)
      return
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(error.code)
      setLoading(false)
      return
    }

    setLocation('/')
  }, [])

  return (
    <div className='background-gradient flex min-h-screen w-full flex-col items-center justify-center'>
      <section className='mx-auto w-[520px] rounded-lg border bg-white px-8 py-10 shadow-xl'>
        <div className='text-center'>
          <h1 className='text-2xl font-semibold'>Regístrate</h1>
          <p className='mt-1 text-sm text-zinc-600'>
            Crea una nueva cuenta en el sistema para comenzar a usarlo.
          </p>
        </div>
        <form
          className='mt-8'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-2 gap-x-4'>
            <label className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>Nombres</span>
              <input
                required
                placeholder='John'
                name='user-name'
                type='text'
                className='rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-800 placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
              />
            </label>
            <label className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>Apellidos</span>
              <input
                required
                placeholder='Doe'
                name='user-lastname'
                type='text'
                className='rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-800 placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
              />
            </label>
          </div>
          <label className='mt-4 flex flex-col gap-2'>
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
          {errorMessage && <p className='mt-2 text-sm text-red-500'>{errorMessage}</p>}
          <button
            disabled={loading}
            type='submit'
            className='mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-purple-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60'
          >
            {loading && <Spinner />} <span>Crear cuenta</span>
          </button>

          <p className='mt-4 text-center text-sm'>
            ¿Ya tienes una cuenta?{' '}
            <Link
              to='/login'
              className='text-purple-700'
            >
              Inicia sesión aquí.
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}
