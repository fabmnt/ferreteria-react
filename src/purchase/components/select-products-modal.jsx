import { Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { getProducts } from '../../services/products'
import { IoIosAdd } from 'react-icons/io'

export function SelectProductsModal({
  closeModal,
  modalOpened,
  onNewSelectedProduct,
  selectedProducts,
  supplierId,
}) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const originalProducts = useRef([])

  useEffect(() => {
    if (modalOpened === false) {
      return
    }
    setIsLoading(true)
    getProducts()
      .then(({ data, error }) => {
        if (error) {
          return
        }
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))
        originalProducts.current = sortedData
        setProducts(sortedData)
      })
      .finally(() => {
        setIsLoading(false)
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

  const canAddProduct = (product) => {
    const isAlreadyAdded = selectedProducts.some((p) => p.id === product.id)
    if (supplierId == null) {
      return !isAlreadyAdded
    }

    return !isAlreadyAdded && product.supplier_id === supplierId
  }

  return (
    <Modal
      onClose={closeModal}
      size='5xl'
      show={modalOpened}
      dismissible
    >
      <Modal.Header>Agrega productos a la órden de compra</Modal.Header>
      <Modal.Body>
        <div className='mb-6'>
          <TextInput
            rightIcon={CiSearch}
            onChange={(e) => setQuery(e.target.value)}
            type='search'
            placeholder='Busca un producto por nombre o marca'
          />
        </div>

        <section className='scroll-bar h-[400px] overflow-auto scroll-smooth'>
          <table className='relative w-full table-fixed text-left text-sm'>
            <thead className='sticky top-0 z-10 border-b bg-white text-xs'>
              <tr className='[&>th]:py-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                <th className='w-[60px]'>#</th>
                <th className='w-[250px]'>Producto</th>
                <th>Costo</th>
                <th>Descuento</th>
                <th>Existencias</th>
                <th>Marca</th>
                <th>Proveedor</th>
                <th className='w-[50px]' />
              </tr>
            </thead>
            <tbody className=''>
              {isLoading &&
                Array.from({ length: 12 }).map((_, index) => (
                  <tr key={index}>
                    <td
                      colSpan='7'
                      className='h-10 px-2 align-middle'
                    >
                      <div className='flex animate-pulse space-x-4'>
                        <div className='flex-1 p-1'>
                          <div className='h-7 w-full rounded-lg bg-neutral-200' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

              {products.map((product) => (
                <tr
                  className={`[&>td]:h-10 [&>td]:border-b [&>td]:align-middle ${!canAddProduct(product) && 'opacity-50'}`}
                  key={product.id}
                >
                  <td>
                    <span className='inline-block rounded bg-gray-200 px-2 py-1 text-gray-800'>
                      #{product.id}
                    </span>
                  </td>
                  <td>{product.name}</td>
                  <td>C$ {product.cost}</td>
                  <td>{product.discount ?? 0}%</td>
                  <td>{product.stock}</td>
                  <td>{product.brand}</td>
                  <td>{product.suppliers.name}</td>
                  <td>
                    <Button
                      disabled={!canAddProduct(product)}
                      size='sm'
                      color='light'
                      pill
                      onClick={() => onNewSelectedProduct(product)}
                    >
                      <IoIosAdd className='size-4' />
                    </Button>
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
