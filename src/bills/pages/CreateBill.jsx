import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '../../store/session'
import { AddProductModal } from '../components/add-product-modal'
import { BillInformation } from '../components/bill-information'
import { BillProducts } from '../components/bill-products'
import { ClientInformation } from '../components/client-information'

export function CreateBill() {
  const employee = useSessionStore((state) => state.employee)
  const employeeFullName = employee ? `${employee.name} ${employee.last_name}.` : ''
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [billInformation, setBillInformation] = useState({
    paymentMethod: 'cash',
    discount: 0,
    IVA: 16,
    totalBilled: '0',
    totalIVA: '0',
    totalDiscount: '0',
    totalToPay: '0',
  })
  const dialogRef = useRef(null)
  const [billProducts, setBillProducts] = useState([])
  const [productsQuantity, setProductsQuantity] = useState({})

  useEffect(() => {
    let totalBilled = 0

    for (const product of billProducts) {
      totalBilled = totalBilled + product.price * (productsQuantity[product.id] ?? 1)
    }

    updateBillInformation({ totalBilled: parseFloat(totalBilled.toFixed(2)) })
  }, [billProducts, productsQuantity])

  useEffect(() => {
    const totalIVA = +billInformation.totalBilled * (billInformation.IVA / 100)

    updateBillInformation({ totalIVA: totalIVA.toFixed(2) })
  }, [billInformation.IVA, billInformation.totalBilled])

  useEffect(() => {
    const totalDiscount = +billInformation.totalBilled * (billInformation.discount / 100)

    updateBillInformation({ totalDiscount: totalDiscount.toFixed(2) })
  }, [billInformation.discount, billInformation.totalBilled])

  useEffect(() => {
    const totalToPay =
      +billInformation.totalBilled - +billInformation.totalDiscount + +billInformation.totalIVA

    updateBillInformation({ totalToPay: totalToPay.toFixed(2) })
  }, [billInformation.totalBilled, billInformation.totalDiscount, billInformation.totalIVA])

  const addBillProduct = (product) => {
    setBillProducts((prevProducts) => [...prevProducts, product])
  }

  const openAddProductModal = () => {
    dialogRef.current?.showModal()
  }

  const updateCurrentCustomer = (customer) => {
    setCurrentCustomer(customer)
  }

  const updateBillInformation = (info) => {
    setBillInformation((prevInfo) => ({ ...prevInfo, ...info }))
  }

  const updateProductsQuantity = (quantities) => {
    setProductsQuantity((prev) => ({ ...prev, ...quantities }))
  }

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <h2 className='text-3xl font-semibold'>Facturación</h2>
        <p className='text-sm text-neutral-600'>Ingresa el registro de una nueva factura.</p>
      </div>

      <section className='grid grid-cols-3 gap-4'>
        <div className='col-span-2 rounded border bg-white p-4'>
          <ClientInformation
            currentCustomer={currentCustomer}
            updateCurrentCustomer={updateCurrentCustomer}
          />
        </div>
        <div className='col-span-1 flex flex-col gap-4 rounded border bg-white p-4'>
          <BillInformation
            employeeFullName={employeeFullName}
            billInformation={billInformation}
            updateBillInformation={updateBillInformation}
          />
        </div>
        <div className='col-span-2 rounded border bg-white p-4'>
          <BillProducts
            products={billProducts}
            openAddProductModal={openAddProductModal}
            productsQuantity={productsQuantity}
            updateProductsQuantity={updateProductsQuantity}
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
