import { useCallback, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { supabase } from '../../db/supabase'
import { CardContainer } from '../components/card-container'
import { CardTitle } from '../components/card-title'
import { RegisterForm } from '../components/register-form'
import { useRegister } from '../hooks/use-register'

export function Register() {
  const [, setLocation] = useLocation()
  const { error, errorMessage, loading, setError, setErrorMessage, setLoading } = useRegister()

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
    const newEmployee = { user_id: data.user.id, name, last_name: lastname, email, role_id: 3 }
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
      <CardContainer>
        <CardTitle
          title='Regístrate'
          subtitle='Crea una nueva cuenta en el sistema para comenzar a usarlo.'
        />
        <div className='mt-8'>
          <RegisterForm
            errorMessage={errorMessage}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
        <p className='mt-4 text-center text-sm'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            to='/login'
            className='text-purple-700'
          >
            Inicia sesión aquí.
          </Link>
        </p>
      </CardContainer>
    </div>
  )
}
