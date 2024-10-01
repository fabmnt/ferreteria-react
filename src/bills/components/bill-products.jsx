import { IoIosAdd } from 'react-icons/io'
import { Input } from '../../components/input'
import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'

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
    const newProductsQuantity = { ...quantities  }
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

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h4 className='font-semibold'>Productos</h4>
        <button
          onClick={() => openAddProductModal()}
          className='flex items-center justify-center gap-2 text-sm'
        >
          <IoIosAdd className='size-6' />
          <span>Agregar producto</span>
        </button>
      </div>
      {products.length === 0 && (
        <div className='flex h-60 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 p-6'>
          <span className='text-2xl font-semibold text-gray-600 opacity-60'>
            Añade productos a la factura
          </span>
        </div>
      )}

      {products.length > 0 && (
        <table className='sticky top-0 z-10 w-full table-auto bg-white text-left text-sm'>
          <thead className='sticky top-0 z-10 border-b bg-white'>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th className='w-[10ch]'>
                Total
              </th>
              <th className='w-[5ch] '>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className=''>
            {products.map((product) => (
              <tr
                className='[&>td]:h-10 [&>td]:align-middle'
                key={product.id}
              >
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>C$ {product.price}</td>
                <td>
                  <Input
                    type='number'
                    min={1}
                    max={product.stock}
                    className='w-[6ch] px-2 py-1'
                    value={quantities[product.id] ?? 1}
                    onInput={(e) => handleUpdateQuantity(e, product.id)}
                  />
                </td>
                <td>
                  C$ {product.price * (quantities[product.id] ?? 1)}
                </td>
                <td className='flex justify-center'>
                  <button
                    onClick={() => removeProduct(product.id)}
                  >
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
      )}
    </>
  )
}
