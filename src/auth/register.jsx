import { Link } from 'wouter'
import { supabase } from '../db/supabase'

export function Register () {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const email = form.get('user-email')
    const password = form.get('user-password')

    const { data, error } = await supabase.auth.signUp({ email, password })

    console.log({ data, error })
  }

  return (
    <div className='w-full background-gradient min-h-screen flex flex-col items-center justify-center'>
      <section className='rounded-lg shadow-xl bg-white px-8 py-10 w-[520px] mx-auto border'>
        <div className='text-center'>
          <h1 className='font-semibold text-2xl'>Regístrate</h1>
          <p className='text-zinc-600 text-sm mt-1'>
            Crea una nueva cuenta en el sistema para comenzar a usarlo.
          </p>
        </div>
        <form className='mt-8' onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-x-4'>
            <label className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>Nombres</span>
              <input
                placeholder='John'
                name='user-name'
                type='email'
                className='placeholder:text-sm text-zinc-800 px-2 py-1.5 border rounded-md border-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
              />
            </label>
            <label className='flex flex-col gap-2'>
              <span className='text-sm font-semibold'>Apellidos</span>
              <input
                placeholder='Doe'
                name='user-lastname'
                type='email'
                className='placeholder:text-sm text-zinc-800 px-2 py-1.5 border rounded-md border-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
              />
            </label>
          </div>
          <label className='flex flex-col gap-2 mt-4'>
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
          <button
            type='submit'
            className='mt-8 w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors text-sm'
          >
            Crear cuenta
          </button>

          <p className='text-sm text-center mt-4'>
            ¿Ya tienes una cuenta?{' '}
            <Link to='/login' className='text-purple-700'>
              Inicia sesión aquí.
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}
