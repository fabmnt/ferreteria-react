import { Button, TextInput } from 'flowbite-react'
import { useEffect, useMemo, useState } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { IoIosRemoveCircleOutline } from 'react-icons/io'
import { cn } from '../../utils/cn'
import { SelectProductsModal } from '../components/select-products-modal'
import { toast } from 'sonner'
import { createOrderProducts, createPurchaseOrder } from '../../services/products'

export function CreatePurchase() {
  const [showSelectProductsModal, setShowSelectProductsModal] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productsQuantities, setProductsQuantities] = useState({})
  const [supplier, setSupplier] = useState(null)

  useEffect(() => {
    const quantities = {}

    selectedProducts.forEach((product) => {
      quantities[product.id] = 1
    })

    setProductsQuantities(quantities)
  }, [selectedProducts])

  const handleCloseSelectProductsModal = () => {
    setShowSelectProductsModal(false)
  }

  const handleNewSelectedProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.length === 0) {
        setSupplier(product.suppliers)
        return [...prev, product]
      }
      if (product.supplier_id !== supplier.id) {
        return prev
      }
      return [...prev, product]
    })
  }

  const sliceDescription = (description) => {
    const maxDescriptionLength = 50
    if (description.length <= maxDescriptionLength) {
      return description
    }

    return description.slice(0, maxDescriptionLength) + '...'
  }

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  const handleUpdateProductQuantity = (e, productId) => {
    const newQuantity = +e.target.value
    const newProductQuantities = { ...productsQuantities }
    newProductQuantities[productId] = newQuantity
    setProductsQuantities(newProductQuantities)
  }

  const orderedSelectedProducts = useMemo(() => {
    return [...selectedProducts].sort((a, b) => a.id - b.id)
  }, [selectedProducts])

  const totalToPay = useMemo(() => {
    let total = 0

    for (const product of selectedProducts) {
      total += +product.cost * productsQuantities[product.id]
    }

    return total
  }, [selectedProducts, productsQuantities])

  const handleCreaNewPurchaseOrder = async () => {
    if (supplier == null || selectedProducts.length === 0) {
      toast.error('Información faltante para realizar la compra')
      return
    }

    const order = {
      supplier_id: supplier.id,
      total_order: totalToPay,
      status: 'pending',
      delivered: false,
    }

    const {
      error,
      data: [createdOrder],
    } = await createPurchaseOrder(order)

    if (error) {
      toast.error(error.message)
      return
    }

    const { id: orderID } = createdOrder
    const newOrderProducts = []

    for (const product of selectedProducts) {
      const newProduct = {
        order_id: orderID,
        product_id: product.id,
        quantity: productsQuantities[product.id],
      }
      newOrderProducts.push(newProduct)
    }

    const { error: createProductsError } = await createOrderProducts(
      newOrderProducts,
      selectedProducts,
    )

    if (createProductsError) {
      toast.error(createProductsError.message)
      return
    }

    setSupplier(null)
    setSelectedProducts([])
    toast.success('Orden guardada correctamente')
  }

  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>Órden de compra</h2>
          <p className='text-sm text-neutral-600'>Crea una nueva órden de compra.</p>
        </div>
        <div>
          <Button
            color='light'
            onClick={() => setShowSelectProductsModal(true)}
          >
            <div className='flex items-center gap-2'>
              Añadir productos <FaRegCircleCheck />
            </div>
          </Button>
        </div>
      </div>
      {supplier != null && (
        <div className='my-4 rounded border bg-white p-4'>
          <h4 className='font-semibold'>Información del proveedor</h4>
          <div className='mt-2 grid grid-cols-4'>
            <div>
              <p className='text-sm'>Proveedor: {supplier.name}</p>
            </div>
            <div>
              <p className='text-sm'>Teléfono: {supplier.phone}</p>
            </div>
            <div>
              <p className='text-sm'>Correo: {supplier.email ?? 'Sin correo'}</p>
            </div>
            <div>
              <p className='text-sm'>Dirección: {supplier.address}</p>
            </div>
          </div>
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div className='mt-6 flex items-center justify-center rounded bg-neutral-200/80 px-6 py-8'>
          <p className='text-lg text-neutral-600'>Empieza añadiendo productos a la compra.</p>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className='scroll-bar max-h-[360px] w-full overflow-auto rounded'>
          <table className='w-full table-fixed rounded border bg-white text-left text-sm'>
            <thead className='border-b text-xs'>
              <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                <th className='w-[60px]'>#</th>
                <th className='w-[180px]'>Producto</th>
                <th className='w-[180px]'>Descripción</th>
                <th>Marca</th>
                <th className='w-[120px]'>Categoría</th>
                <th>Costo</th>
                <th>Descuento</th>
                <th className='w-[100px]'>Existencias</th>
                <th className='w-[100px]'>Cantidad</th>
                <th className='w-[80px]' />
              </tr>
            </thead>
            <tbody>
              {orderedSelectedProducts.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    '[&>td]:h-16 [&>td]:overflow-clip [&>td]:border-b [&>td]:px-2 [&>td]:align-middle',
                  )}
                >
                  <td>
                    <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                      #{product.id}
                    </span>
                  </td>
                  <td>{product.name}</td>
                  <td className='overflow-clip'>{sliceDescription(product.description)}</td>
                  <td>{product.brand}</td>
                  <td>{product.categories.name}</td>
                  <td>C$ {product.cost}</td>
                  <td>{product.discount ?? 0}%</td>
                  <td className={cn(product.stock === 0 && 'text-red-600')}>
                    {product.stock === 0 ? 'Sin existencias' : product.stock}
                  </td>
                  <td>
                    <TextInput
                      min={1}
                      type='number'
                      value={productsQuantities[product.id] ?? 1}
                      onChange={(e) => handleUpdateProductQuantity(e, product.id)}
                    />
                  </td>
                  <td>
                    <Button
                      color='light'
                      size='sm'
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <IoIosRemoveCircleOutline className='h-6 w-5 text-red-700' />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {supplier != null && selectedProducts.length > 0 && (
        <div className='mt-4 flex justify-end'>
          <div className='flex items-center gap-4 border bg-white p-4'>
            <p className='text-sm'>
              Total a pagar: <strong>C$ {totalToPay}</strong>
            </p>
            <Button
              onClick={handleCreaNewPurchaseOrder}
              color='blue'
            >
              Guardar órden de compra
            </Button>
          </div>
        </div>
      )}
      <SelectProductsModal
        closeModal={handleCloseSelectProductsModal}
        onNewSelectedProduct={handleNewSelectedProduct}
        modalOpened={showSelectProductsModal}
        selectedProducts={selectedProducts}
        supplierId={supplier?.id}
      />
    </div>
  )
}
