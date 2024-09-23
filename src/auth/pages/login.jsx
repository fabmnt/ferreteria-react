import { Link, useSearch, useLocation } from 'wouter'
import { CardContainer } from '../components/card-container'
import { CardTitle } from '../components/card-title'
import { LoginForm } from '../components/login-form'
import { CiWarning } from 'react-icons/ci'
import { useSessionStore } from '../../store/session'
import { useEffect } from 'react'

export function Login() {
  const searchParamsString = useSearch()
  const searchParams = new URLSearchParams(searchParamsString)
  const session = useSessionStore((state) => state.session)
  const [, navigate] = useLocation()

  useEffect(() => {
    if (session) {
      navigate('/')
    }
  }, [session])

  return (
    <div className='background-gradient flex min-h-screen w-full flex-col items-center justify-center'>
      <CardContainer>
        <CardTitle
          title='¡Bienvenido de Nuevo!'
          subtitle='Inicia sesión con tu cuenta para acceder al sistema.'
        />
        <div>
          {searchParams.has('not_verified') && (
            <div className='mt-2 flex items-center justify-between gap-2 rounded border border-red-700 bg-red-200 px-4 py-2'>
              <CiWarning className='m-0 h-10 w-12 p-0 text-red-700' />
              <p className='text-sm text-red-700'>
                Tu cuenta no ha sido verificada. Por favor, contacta con el administrador.
              </p>
            </div>
          )}
        </div>
        <div className='mt-4'>
          <LoginForm />
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
