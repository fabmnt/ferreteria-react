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
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            Información principal de la ferretería.
          </p>
        </div>
      </div>
      <section className='mt-4 grid grid-cols-2 gap-4'>
        {/* Total de ventas */}
        <div className='h-[310px] rounded border bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900'>
          <div className='mb-2 flex items-center gap-1'>
            <h4 className='font-medium dark:text-gray-300'>Total de ventas</h4>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>Últimos 30 días</p>
          </div>
          <div className='h-full w-full p-4'>
            <SellsChart />
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className='h-[310px] rounded border bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900'>
          <div className='mb-2'>
            <h4 className='font-medium dark:text-gray-300'>Productos más vendidos</h4>
          </div>
          <div className='h-full w-full p-4'>
            <MostSelledProductsChart />
          </div>
        </div>

        {/* Clientes más recurrentes */}
        <div className='col-span-2 h-[310px] rounded border bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900'>
          <div className='mb-2'>
            <h4 className='font-medium dark:text-gray-200'>Clientes más recurrentes</h4>
          </div>
          <MostFrequentClientsTable />
        </div>
      </section>
    </div>
  )
}
