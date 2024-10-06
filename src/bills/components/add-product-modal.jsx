import { Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { getProducts } from '../../services/products'

export function AddProductModal({ closeModal, modalOpened, addBillProduct, billProducts }) {
  const originalProducts = useRef([])
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (modalOpened === false) {
      return
    }

    getProducts().then(({ data, error }) => {
      if (error) {
        return
      }
      const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))
      originalProducts.current = sortedData
      setProducts(sortedData)
    })
  }, [modalOpened])

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
    <Modal
      onClose={closeModal}
      size='5xl'
      show={modalOpened}
      dismissible
    >
      <Modal.Header>Agrega productos a la factura actual</Modal.Header>
      <Modal.Body>
        <div className='mb-6'>
          <TextInput
            rightIcon={CiSearch}
            onChange={(e) => setQuery(e.target.value)}
            type='search'
            placeholder='Busca un producto por nombre o marca'
          />
        </div>

        <section className='scroll-bar max-h-[400px] overflow-auto scroll-smooth'>
          <table className='relative w-full table-auto text-left text-sm'>
            <thead className='sticky top-0 z-10 border-b bg-white text-xs'>
              <tr className='[&>th]:py-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                <th>#</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Descuento</th>
                <th>Existencias</th>
                <th>Marca</th>
                <th />
              </tr>
            </thead>
            <tbody className=''>
              {products.map((product) => (
                <tr
                  className={`[&>td]:h-10 [&>td]:border-b [&>td]:align-middle ${!canShowProduct(product) ? 'opacity-50' : ''}`}
                  key={product.id}
                >
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>C$ {product.price}</td>
                  <td>{product.discount ?? 0}%</td>
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
      </Modal.Body>
    </Modal>
  )
}
