import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '../../store/session'
import { AddProductModal } from '../components/add-product-modal'
import { BillInformation } from '../components/bill-information'
import { BillProducts } from '../components/bill-products'
import { ClientInformation } from '../components/client-information'
import { Button, Spinner } from 'flowbite-react'
import { createBill, updateBillProducts } from '../../services/bills'

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
  const [isCreatingNewBill, setIsCreatingNewBill] = useState(false)

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

  const handleCreateBill = async () => {
    if (currentCustomer == null) {
      window.alert('Debes seleccionar un cliente.')
      return
    }

    if (billProducts.length === 0) {
      window.alert('Debes agregar productos a la factura.')
      return
    }
    setIsCreatingNewBill(true)

    const newBillDetails = {
      customer_id: currentCustomer.id,
      employee_id: employee.id,
      payment_method: billInformation.paymentMethod,
      total_sell: +billInformation.totalBilled,
      total_payed: +billInformation.totalToPay,
      total_discount: +billInformation.totalDiscount,
      total_iva: +billInformation.totalIVA,
    }

    const { error: billError, data } = await createBill(newBillDetails)
    if (billError != null) {
      setIsCreatingNewBill(false)
      return
    }
    const [bill] = data

    const products = billProducts.map((product) => ({
      id: product.id,
      quantity: productsQuantity[product.id] ?? 1,
    }))

    const { error } = await updateBillProducts(bill.id, products)
    if (error) {
      window.alert(error.message)
    }

    setIsCreatingNewBill(false)
  }

  const handleNewBill = () => {
    setCurrentCustomer(null)
    setBillProducts([])
    setProductsQuantity({})
    setBillInformation({
      paymentMethod: 'cash',
      discount: 0,
      IVA: 16,
      totalBilled: '0',
      totalIVA: '0',
      totalDiscount: '0',
      totalToPay: '0',
    })
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
            setProducts={setBillProducts}
          />
        </div>
        <section>
          <div className='flex flex-col gap-4'>
            <Button
              className='w-full'
              color='gray'
              onClick={handleNewBill}
            >
              Nueva factura
            </Button>
            <Button
              className='w-full'
              color='blue'
              onClick={handleCreateBill}
            >
              <div className='flex items-center gap-2'>
                {isCreatingNewBill ? 'Guardando' : 'Guardar factura'}
                {isCreatingNewBill && (
                  <Spinner
                    className=''
                    size='sm'
                  />
                )}
              </div>
            </Button>
          </div>
        </section>
      </section>

      <AddProductModal
        dialogRef={dialogRef}
        billProducts={billProducts}
        addBillProduct={addBillProduct}
      />
    </div>
  )
}
