import { useRef, useState } from 'react'
import { useSessionStore } from '../../store/session'
import { AddProductModal } from '../components/add-product-modal'
import { BillInformation } from '../components/bill-information'
import { BillProducts } from '../components/bill-products'
import { ClientInformation } from '../components/client-information'

export function CreateBill() {
  const employee = useSessionStore((state) => state.employee)
  const employeeFullName = employee ? `${employee.name} ${employee.last_name}.` : ''
  const dialogRef = useRef(null)
  const [billProducts, setBillProducts] = useState([])

  const addBillProduct = (product) => {
    setBillProducts((prevProducts) => [...prevProducts, product])
  }

  const openAddProductModal = () => {
    dialogRef.current?.showModal()
  }

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold'>Facturación</h2>
        <p className='text-sm text-zinc-500'>Ingresa el registro de una nueva factura.</p>
      </div>

      <section className='grid grid-cols-3 gap-4'>
        <div className='col-span-2 rounded border p-4'>
          <ClientInformation />
        </div>
        <div className='col-span-1 flex flex-col gap-4 rounded border p-4'>
          <BillInformation employeeFullName={employeeFullName} />
        </div>
        <div className='col-span-2 rounded border p-4'>
          <BillProducts
            products={billProducts}
            openAddProductModal={openAddProductModal}
          />
        </div>
      </section>

      <AddProductModal
        dialogRef={dialogRef}
        billProducts={billProducts}
        addBillProduct={addBillProduct}
      />
    </div>
  )
}
