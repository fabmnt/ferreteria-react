import { AiOutlineDelete, AiOutlinePrinter } from 'react-icons/ai'
import { useLocation } from 'wouter'
import { getBillProducts } from '../../services/bills'
import { BillReport } from './bill-report'
import { useState } from 'react'

export function BillsTable({ bills, isLoading, onDeleteBill }) {
  const [, navigate] = useLocation()
  const [__html, setHtml] = useState('')
  const paymentMethodsTranslations = {
    'cash': 'Efectivo',
    'debit card': 'Tarjeta de débito',
    'credit card': 'Tarjeta de crédito',
  }

  const handleCreateReport = async (bill) => {
    const newWindow = window.open('', '_blank')
    const { data: billProducts } = await getBillProducts(bill.id)

    if (newWindow == null) {
      return
    }

    const calculateTotal = (product) => {
      const discount = +product.inventory.discount ?? 0
      const total = +product.inventory.price * +product.quantity
      const totalDiscount = total * (discount / 100)
      return total - totalDiscount
    }

    const renderProduct = (product) => `  
      <tr>
        <td>#${product.inventory.id}</td>
        <td>${product.inventory.name}</td>
        <td>${product.quantity}</td>
        <td>C$${product.inventory.price.toFixed(2)}</td>
        <td>${product.inventory.discount ?? 0}%</td>
        <td>C$${calculateTotal(product).toFixed(2)}</td>
      </tr>
    `

    const report = `
      <html>
        <head>
          <title>Factura #${bill.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            th {
              text-align: left;
            }
            p {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div style="padding: 16px 0; display: flex; flex-direction: column; gap: 24px 0; width: 820px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between;">
              <p style="font-weight: bold">Factura #${bill.id}</p>
              <p>${new Date(bill.created_at).toLocaleDateString()}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex; flex-direction: column">
                <p style="font-weight: bold">Cliente: #${bill.customerId}</p>
                <p>Nombre del cliente: ${bill.customers.name + ' ' + bill.customers.last_name} </p>
              </div>
              <p>Método de pago: ${paymentMethodsTranslations[bill.payment_method]}</p>
            </div>
            <p>Atendido por: ${bill.employees.name + ' ' + bill.employees.last_name}</p>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${billProducts.map(renderProduct).join('')}
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end">
              <div style="display: flex; flex-direction: column; gap: 8px 0; font-weight: bold;">
                <p>Total productos: ${bill.total_products ?? 0}</p>
                <p>Total vendido: C$${bill.total_sell.toFixed(2)}</p>
                <p>Total IVA: C$${bill.total_iva.toFixed(2)}</p>
                <p>Total descuento: C$${bill.total_discount.toFixed(2)}</p>
                <p>Total pagado: C$${bill.total_payed.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
    setHtml(report)
    newWindow.document.write(report)
    newWindow.print()
  }

  return (
    <div className='scroll-bar mb-4 h-[450px] overflow-auto'>
      <table className='table-fixed text-left text-sm'>
        <thead className='border-b text-xs'>
          <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
            <th className='w-[60px]'>#</th>
            <th className='w-[180px]'>Cliente</th>
            <th className='w-[120px]'>Fecha</th>
            <th className='w-[180px]'>Método de pago</th>
            <th className='w-[60px]'>Total productos</th>
            <th className='w-[160px]'>Total vendido</th>
            <th className='w-[160px]'>Total IVA</th>
            <th className='w-[160px]'>Total descuento</th>
            <th className='w-[160px]'>Total pagado</th>
            <th className='w-[220px]'>Vendedor</th>
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
              created_at: createdAt,
              customers: { name, last_name: lastName },
              payment_method: paymentMethod,
              total_products: totalProducts,
              total_sell: totalSell,
              total_iva: totalIVA,
              total_discount: totalDiscount,
              total_payed: totalPayed,
              employees: { name: employeeName, last_name: employeeLastName },
              customer_id: customerId,
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
                <td>{new Date(createdAt).toLocaleDateString()}</td>
                <td>{paymentMethodsTranslations[paymentMethod]}</td>
                <td>{totalProducts ?? 0}</td>
                <td>C$ {totalSell.toFixed(2)}</td>
                <td>C$ {totalIVA.toFixed(2)}</td>
                <td>C$ {totalDiscount.toFixed(2)}</td>
                <td>C$ {totalPayed.toFixed(2)}</td>
                <td>{`${employeeName} ${employeeLastName}`}</td>
                <td>
                  <div className='flex gap-4'>
                    <button
                      color='light'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteBill(id)
                      }}
                    >
                      <AiOutlineDelete className='h-6 w-5 text-red-700' />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCreateReport({
                          id,
                          created_at: createdAt,
                          customers: { name, last_name: lastName },
                          payment_method: paymentMethod,
                          total_products: totalProducts,
                          total_sell: totalSell,
                          total_iva: totalIVA,
                          total_discount: totalDiscount,
                          total_payed: totalPayed,
                          employees: { name: employeeName, last_name: employeeLastName },
                          customerId,
                        })
                      }}
                      color='light'
                      size='sm'
                    >
                      <AiOutlinePrinter className='h-6 w-5' />
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <BillReport __html={__html} />
    </div>
  )
}
