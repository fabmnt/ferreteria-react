import { IoIosAdd } from 'react-icons/io'
import { Input } from '../../components/input'
import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { Button } from 'flowbite-react'

export function BillProducts({
  openAddProductModal,
  products,
  productsQuantity,
  updateProductsQuantity,
  setProducts,
}) {
  const [quantities, setQuantities] = useState(productsQuantity)

  const handleUpdateQuantity = (e, productId) => {
    e.preventDefault()
    const inputQuantity = e.target.value
    const newProductsQuantity = { ...quantities }
    const product = products.find((product) => product.id === productId)

    if (product == null) {
      return
    }

    const { stock } = product

    if (Number(inputQuantity) > stock) {
      newProductsQuantity[productId] = stock
    } else if (Number(inputQuantity) < 1) {
      newProductsQuantity[productId] = 1
    } else {
      newProductsQuantity[productId] = Number(inputQuantity)
    }

    setQuantities(newProductsQuantity)
    updateProductsQuantity(newProductsQuantity)
  }

  const removeProduct = (productId) => {
    const updateProducts = products.filter((product) => product.id !== productId)
    setProducts(updateProducts)

    const newProductsQuantity = { ...quantities }
    delete newProductsQuantity[productId]
    setQuantities(newProductsQuantity)
    updateProductsQuantity(newProductsQuantity)
  }

  const calculateProductTotal = (product) => {
    const quantity = quantities[product.id] ?? 1
    const discount = ((product.discount ?? 0) / 100) * product.price
    const total = product.price * quantity - discount
    return total
  }

  return (
    <>
      <div className='mb-4 flex justify-between'>
        <h4 className='font-semibold'>Productos</h4>
        <Button
          outline
          size='xs'
          color='light'
          onClick={() => openAddProductModal()}
        >
          <div className='flex items-center justify-center gap-2 text-sm'>
            <IoIosAdd className='size-6' />
            <span>Agregar producto</span>
          </div>
        </Button>
      </div>
      {products.length === 0 && (
        <div className='flex h-60 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 p-6'>
          <span className='text-lg font-semibold text-gray-600 opacity-60'>
            Añade productos a la factura
          </span>
        </div>
      )}

      {products.length > 0 && (
        <div className='scroll-bar mt-2 h-[200px] overflow-y-auto scroll-smooth'>
          <table className='sticky top-0 z-10 w-full table-auto bg-white text-left text-sm'>
            <thead className='sticky top-0 z-10 border-b bg-white'>
              <tr className='text-xs [&>th]:py-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                <th>#</th>
                <th className='w-[120px]'>Producto</th>
                <th className='w-[120px]'>Marca</th>
                <th>Inventario</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Descuento</th>
                <th className=''>Total</th>
                <th className='w-[5ch]' />
              </tr>
            </thead>
            <tbody className=''>
              {products.map((product) => (
                <tr
                  className='[&>td]:h-10 [&>td]:border-b [&>td]:align-middle'
                  key={product.id}
                >
                  <td>
                    <span className='inline-block rounded bg-gray-200 px-2 py-1 text-gray-800'>
                      #{product.id}
                    </span>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.stock}</td>
                  <td>C$ {product.price}</td>
                  <td>
                    <Input
                      type='number'
                      min={1}
                      max={product.stock}
                      className='w-[6ch] p-1 text-center'
                      value={quantities[product.id] ?? 1}
                      onInput={(e) => handleUpdateQuantity(e, product.id)}
                    />
                  </td>
                  <td>{product.discount ?? 0}%</td>
                  <td>C$ {calculateProductTotal(product).toFixed(2)}</td>
                  <td className='flex justify-center'>
                    <button onClick={() => removeProduct(product.id)}>
                      <AiOutlineDelete className='h-6 w-5 text-red-700' />
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan='6'
                    className='text-center'
                  >
                    <span className='text-gray-500'>No hay productos disponibles.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
