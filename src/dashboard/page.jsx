import { Button, Datepicker } from 'flowbite-react'
import { SellsChart } from './components/sells-chart'

export function Dashboard() {
  const handleChangeDate = (date) => {
    console.log(date)
  }

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
              <Datepicker onChange={handleChangeDate} />
            </div>
          </Button>
        </div>
      </div>
      <section className='mt-4 grid grid-cols-2 gap-4'>
        <div className='rounded border bg-white p-4'>
          <SellsChart />
        </div>
        <div className='h-[220px] rounded border bg-white p-4' />
        <div className='col-span-2 h-[420px] rounded border bg-white p-4' />
      </section>
    </div>
  )
}
