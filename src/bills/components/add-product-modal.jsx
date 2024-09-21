import { useEffect, useRef, useState } from 'react'
import { IoIosAdd } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { getProducts } from '../../services/products'

export function AddProductModal({ dialogRef, addBillProduct, billProducts }) {
  const originalProducts = useRef([])
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    getProducts().then(({ data, error }) => {
      if (error) {
        return
      }
      const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))
      originalProducts.current = sortedData
      setProducts(sortedData)
    })
  }, [])

  useEffect(() => {
    if (query.trim().length === 0) {
      setProducts(originalProducts.current)
      return
    }

    const filteredProducts = originalProducts.current.filter((product) => {
      const productName = product.name.toLowerCase()
      const productBrand = product.brand.toLowerCase()
      const queryValue = query.toLowerCase()

      return productName.includes(queryValue) || productBrand.includes(queryValue)
    })

    setProducts(filteredProducts)
  }, [query])

  const canShowProduct = (product) => {
    return product.stock > 0 && !billProducts.some((p) => p.id === product.id)
  }

  return (
    <dialog
      ref={dialogRef}
      id='add-product'
      className='mx-auto min-h-[520px] w-[820px] max-w-[1200px] rounded-lg border-2 border-gray-400/40 px-6 py-4 backdrop:backdrop-blur-[1.5px]'
    >
      <div className='flex justify-between'>
        <h3 className='text-lg font-medium'>Agrega productos a la factura actual</h3>
        <button onClick={() => dialogRef.current.close()}>
          <IoClose className='size-6' />
        </button>
      </div>

      <div className='mt-2'>
        <input
          onChange={(e) => setQuery(e.target.value)}
          type='search'
          className='rounded border px-2 py-1 text-sm font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500'
          placeholder='Buscar producto'
        />
      </div>

      <section className='mt-4 max-h-[400px] overflow-auto scroll-smooth'>
        <table className='relative w-full table-auto text-left text-sm'>
          <thead className='sticky top-0 z-10 border-b bg-white'>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Existencias</th>
              <th>Marca</th>
              <th />
            </tr>
          </thead>
          <tbody className=''>
            {products.map((product) => (
              <tr
                className={`[&>td]:h-10 [&>td]:align-middle ${!canShowProduct(product) ? 'opacity-50' : ''}`}
                key={product.id}
              >
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>C$ {product.price}</td>
                <td>{product.stock}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    onClick={() => addBillProduct(product)}
                    disabled={!canShowProduct(product)}
                    className='rounded-full border p-2'
                  >
                    <IoIosAdd className='size-4' />
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
      </section>
    </dialog>
  )
}
