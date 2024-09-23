import { Link } from 'wouter'
import { CardContainer } from '../components/card-container'
import { CardTitle } from '../components/card-title'
import { RegisterForm } from '../components/register-form'

export function Register() {
  return (
    <div className='background-gradient flex min-h-screen w-full flex-col items-center justify-center'>
      <CardContainer>
        <CardTitle
          title='Regístrate'
          subtitle='Crea una nueva cuenta en el sistema para comenzar a usarlo.'
        />
        <div className='mt-4'>
          <RegisterForm />
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
