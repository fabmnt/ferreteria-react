import { useEffect, useState } from 'react'
import { getBills } from '../../services/bills'
import { cn } from '../../utils/cn'

export function MostFrequentClientsTable() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getBills()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }
        const result = []
        for (const bill of data) {
          const customer = result.find((c) => c.customer.id === bill.customer_id)

          if (customer) {
            customer.totalBuys++
          } else {
            result.push({
              customer: bill.customers,
              totalBuys: 1,
            })
          }
        }
        setCustomers(result.sort((a, b) => b.totalBuys - a.totalBuys).slice(0, 5))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className='scroll-bar mb-4 h-[260px] overflow-auto'>
      <table className='w-full table-fixed text-left text-sm'>
        <thead className='border-b text-xs'>
          <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-8 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
            <th className='w-[60px]'>#</th>
            <th className='w-[180px]'>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Compras totales</th>
            <th className='w-[120px]'>Última compra</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 12 }).map((_, index) => (
              <tr key={index}>
                <td
                  colSpan='6'
                  className='h-16 px-2 align-middle'
                >
                  <div className='flex animate-pulse space-x-4'>
                    <div className='flex-1 p-1'>
                      <div className='h-7 w-full rounded-lg bg-neutral-200' />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          {customers.length === 0 && !isLoading && (
            <tr>
              <td
                colSpan='6'
                className='h-16 px-2 align-middle'
              >
                <div className='flex justify-center'>
                  <p className='text-neutral-500'>Aún no hay clientes registrados</p>
                </div>
              </td>
            </tr>
          )}
          {!isLoading &&
            customers.map(({ customer, totalBuys }) => (
              <tr
                key={customer.id}
                className={cn(
                  'hover:bg-neutral-100 [&>td]:h-16 [&>td]:overflow-clip [&>td]:border-b [&>td]:px-2 [&>td]:align-middle',
                )}
              >
                <td>
                  <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                    #{customer.id}
                  </span>
                </td>
                <td>{customer.name + ' ' + customer.last_name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email ?? 'Sin correo'}</td>
                <td>{totalBuys}</td>
                <td>{new Date(customer.last_buy).toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
