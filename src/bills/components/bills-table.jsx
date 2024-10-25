import { Button } from 'flowbite-react'
import { AiOutlineDelete } from 'react-icons/ai'
import { useLocation } from 'wouter'

export function BillsTable({ bills, isLoading, onDeleteBill }) {
  const [, navigate] = useLocation()

  const paymentMethodsTranslations = {
    'cash': 'Efectivo',
    'debit card': 'Tarjeta de débito',
    'credit card': 'Tarjeta de crédito',
  }

  return (
    <div className='scroll-bar mb-4 h-[450px] overflow-auto'>
      <table className='table-fixed text-left text-sm'>
        <thead className='border-b text-xs'>
          <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
            <th className='w-[60px]'>#</th>
            <th className='w-[180px]'>Cliente</th>
            <th className='w-[180px]'>Método de pago</th>
            <th className='w-[150px]'>Total productos</th>
            <th className='w-[120px]'>Total vendido</th>
            <th className='w-[120px]'>Total IVA</th>
            <th className='w-[120px]'>Total descuento</th>
            <th className='w-[120px]'>Total pagado</th>
            <th className='w-[180px]'>Vendedor</th>
            <th className='w-[80px]' />
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 12 }).map((_, index) => (
              <tr key={index}>
                <td
                  colSpan='10'
                  className='h-16 px-2 align-middle'
                >
                  <div className='flex animate-pulse space-x-4'>
                    <div className='h-7 w-full rounded-lg bg-neutral-200' />
                  </div>
                </td>
              </tr>
            ))}

          {bills.length === 0 && !isLoading && (
            <tr>
              <td
                colSpan='10'
                className='h-16 px-2 align-middle'
              >
                <div className='flex justify-center'>
                  <span className='text-neutral-500'>No hay facturas registradas.</span>
                </div>
              </td>
            </tr>
          )}
          {bills.map(
            ({
              id,
              customers: { name, last_name: lastName },
              payment_method: paymentMethod,
              total_products: totalProducts,
              total_sell: totalSell,
              total_iva: totalIVA,
              total_discount: totalDiscount,
              total_payed: totalPayed,
              employees: { name: employeeName, last_name: employeeLastName },
            }) => (
              <tr
                onClick={() => navigate(`/bills/details/${id}`)}
                className='hover:cursor-pointer hover:bg-neutral-100 [&>td]:h-16 [&>td]:overflow-clip [&>td]:border-b [&>td]:px-2 [&>td]:align-middle'
                key={id}
              >
                <td>
                  <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                    #{id}
                  </span>
                </td>
                <td>{`${name} ${lastName}`}</td>
                <td>{paymentMethodsTranslations[paymentMethod]}</td>
                <td>{totalProducts ?? 0}</td>
                <td>C$ {totalSell.toFixed(2)}</td>
                <td>C$ {totalIVA.toFixed(2)}</td>
                <td>C$ {totalDiscount.toFixed(2)}</td>
                <td>C$ {totalPayed.toFixed(2)}</td>
                <td>{`${employeeName} ${employeeLastName}`}</td>
                <td>
                  <Button
                    color='light'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteBill(id)
                    }}
                  >
                    <AiOutlineDelete className='h-6 w-5 text-red-700' />
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}
