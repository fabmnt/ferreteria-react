import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'wouter'
import { getBill, getBillProducts } from '../../services/bills'
import { toast } from 'sonner'
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs'

export function BillDetailsPage() {
  const { id } = useParams()
  const [bill, setBill] = useState(null)
  const [isLoadingBill, setIsLoadingBill] = useState(false)
  const [billProducts, setBillProducts] = useState([])
  const [isLoadingBillProducts, setIsLoadingBillProducts] = useState(false)
  const [, navigate] = useLocation()

  const paymentMethods = {
    'debit card': 'Tarjeta de débito',
    'cash': 'Efectivo',
    'credit card': 'Tarjeta de crédito',
  }

  useBreadcrumbs({ breadcrumbs: ['Facturas', `#${id}`] })

  useEffect(() => {
    setIsLoadingBill(true)
    getBill(id)
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }
        setBill(data)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoadingBill(false)
      })

    setIsLoadingBillProducts(true)
    getBillProducts(id)
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setBillProducts(data)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoadingBillProducts(false)
      })
  }, [id])

  return (
    <div>
      <div className='mb-4 flex justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>Factura #{id}</h2>
          {isLoadingBill && <span className='h-6 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && (
            <p className='text-sm text-neutral-600'>{new Date(bill.created_at).toDateString()}</p>
          )}
        </div>
        <div className='flex flex-col'>
          {isLoadingBill && <span className='h-8 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && !isLoadingBill && (
            <strong className='text-2xl font-medium'>C$ {bill.total_payed}</strong>
          )}
          <p className='place-self-end text-sm text-neutral-600'>Total recibido</p>
        </div>
      </div>
      <section className='grid w-full grid-cols-4 gap-8 text-sm [&>div]:rounded [&>div]:border [&>div]:bg-white [&>div]:p-4'>
        <div className='flex flex-col gap-1'>
          Cliente:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          <strong className='font-semibold'>
            {bill?.customers.name} {bill?.customers.last_name}
          </strong>
        </div>
        <div className='flex flex-col gap-1'>
          Método de pago:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          <strong className='font-semibold'>{paymentMethods[bill?.payment_method]}</strong>
        </div>
        <div className='flex flex-col gap-1'>
          Total productos:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && <strong className='font-semibold'>{bill?.total_products ?? 0}</strong>}
        </div>
        <div className='flex flex-col gap-1'>
          Venta realizada por:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          <strong className='font-semibold'>
            {bill?.employees.name} {bill?.employees.last_name}
          </strong>
        </div>
        <div className='flex flex-col gap-1'>
          Total vendido:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && <strong className='font-semibold'>C$ {bill.total_sell}</strong>}
        </div>
        <div className='flex flex-col gap-1'>
          Total Descuento:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && <strong className='font-semibold'>C$ {bill?.total_discount}</strong>}
        </div>
        <div className='flex flex-col gap-1'>
          Total IVA:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && <strong className='font-semibold'>C$ {bill?.total_iva}</strong>}
        </div>
        <div className='flex flex-col gap-1'>
          Total recibido:
          {isLoadingBill && <span className='h-5 w-24 animate-pulse rounded bg-neutral-200' />}
          {bill != null && <strong className='font-semibold'>C$ {bill?.total_payed}</strong>}
        </div>
      </section>

      <section className='mt-6 rounded border bg-white p-2 py-3'>
        <h3 className='mb-4 font-medium'>Productos vendidos</h3>
        <div className='scroll-bar mb-4 max-h-[280px] w-full overflow-auto'>
          <table className='w-full table-fixed text-left text-sm'>
            <thead className='border-b text-xs'>
              <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                <th className='w-[60px]'>#</th>
                <th className='w-[180px]'>Producto</th>
                <th>Marca</th>
                <th className='w-[120px]'>Categoría</th>
                <th>Costo</th>
                <th>Precio</th>
                <th>Descuento</th>
                <th className='w-[100px]'>Cantidad vendida</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingBillProducts &&
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td
                      colSpan='8'
                      className='h-16 px-2 align-middle'
                    >
                      <div className='flex animate-pulse space-x-4'>
                        <div className='flex-1 p-1'>
                          <div className='h-8 w-full rounded-lg bg-neutral-200' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoadingBillProducts &&
                billProducts.map((product) => (
                  <tr
                    onClick={() => navigate(`/products/${product.inventory.id}`)}
                    className='hover:cursor-pointer hover:bg-neutral-100 [&>td]:h-16 [&>td]:overflow-clip [&>td]:border-b [&>td]:px-2 [&>td]:align-middle'
                    key={product.id}
                  >
                    <td>
                      {' '}
                      <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                        #{product.inventory.id}
                      </span>
                    </td>
                    <td>{product.inventory.name}</td>
                    <td>{product.inventory.brand}</td>
                    <td>{product.inventory.categories.name}</td>
                    <td>C$ {product.inventory.cost}</td>
                    <td>C$ {product.inventory.price}</td>
                    <td>{product.inventory.discount ?? 0}%</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
