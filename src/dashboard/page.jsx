import { useBreadcrumbs } from '../hooks/use-breadcrumbs'
import { MostFrequentClientsTable } from './components/most-frequent-clients-table'
import { MostSelledProductsChart } from './components/most-selled-products-chart'
import { SellsChart } from './components/sells-chart'

export function Dashboard() {
  useBreadcrumbs({ breadcrumbs: ['Dashboard'] })

  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>Dashboard</h2>
          <p className='text-sm text-neutral-600'>Información principal de la ferretería.</p>
        </div>
      </div>
      <section className='mt-4 grid grid-cols-2 gap-4'>
        <div className='h-[350px] rounded border bg-white p-4'>
          <div className='mb-2 flex items-center gap-1'>
            <h4 className='font-medium'>Total de ventas</h4>
            <p className='text-sm text-neutral-600'>Últimos 15 días</p>
          </div>
          <div className='h-full w-full p-4'>
            <SellsChart />
          </div>
        </div>
        <div className='h-[350px] rounded border bg-white p-4'>
          <div className='mb-2'>
            <h4 className='font-medium'>Productos más vendidos </h4>
          </div>
          <div className='h-full w-full p-4'>
            <MostSelledProductsChart />
          </div>
        </div>
        <div className='col-span-2 rounded border bg-white p-4'>
          <div className='mb-2'>
            <h4 className='font-medium'>Clientes más recurrentes</h4>
          </div>
          <MostFrequentClientsTable />
        </div>
      </section>
    </div>
  )
}
