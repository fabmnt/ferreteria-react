import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { Spinner } from '../../components/Spinner'

export function RegisterForm({ handleSubmit, loading, errorMessage }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className='grid grid-cols-2 gap-x-4'>
        <label className='flex flex-col gap-2'>
          <span className='text-sm font-semibold'>Nombres</span>
          <Input
            required
            placeholder='John'
            name='user-name'
            type='text'
          />
        </label>
        <label className='flex flex-col gap-2'>
          <span className='text-sm font-semibold'>Apellidos</span>
          <Input
            required
            placeholder='Doe'
            name='user-lastname'
            type='text'
          />
        </label>
      </div>
      <label className='mt-4 flex flex-col gap-2'>
        <span className='text-sm font-semibold'>Correo electrónico</span>
        <Input
          required
          placeholder='micorreo@correo.com'
          name='user-email'
          type='email'
        />
      </label>
      <label className='mt-4 flex flex-col gap-2'>
        <span className='text-sm font-semibold'>Contraseña</span>
        <Input
          required
          placeholder='********'
          name='user-password'
          type='password'
        />
      </label>
      {errorMessage && <p className='mt-2 text-sm text-red-500'>{errorMessage}</p>}
      <Button
        disabled={loading}
        type='submit'
        className='mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-purple-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60'
      >
        {loading && <Spinner />} <span>Crear cuenta</span>
      </Button>
    </form>
  )
}
