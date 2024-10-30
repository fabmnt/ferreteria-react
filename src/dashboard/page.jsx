import { Button } from 'flowbite-react'
import { CiCalendarDate } from 'react-icons/ci'

export function Dashboard() {
  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>Dashboard</h2>
          <p className='text-sm text-neutral-600'>Información principal de la ferretería.</p>
        </div>
        <div>
          <Button
            color='light'
            size='sm'
          >
            <div className='flex items-center gap-2'>
              Elegir fecha
              <CiCalendarDate size={24} />
            </div>
          </Button>
        </div>
      </div>
      <section className='mt-4 grid grid-cols-2 gap-4'>
        <div className='h-[220px] rounded border bg-white' />
        <div className='h-[220px] rounded border bg-white' />
        <div className='col-span-2 h-[420px] rounded border bg-white' />
      </section>
    </div>
  )
}
