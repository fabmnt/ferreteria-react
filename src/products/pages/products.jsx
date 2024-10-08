import { Button } from 'flowbite-react'
import { IoIosAdd } from 'react-icons/io'
import { ProductsTable } from '../components/products-table'
import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '../../services/products'
import { CreateProductModal } from '../components/create-product-modal'

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showCreateProductModal, setShowCreateProductModal] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  useEffect(() => {
    getCategories().then(({ data }) => {
      if (data == null) {
        return
      }
      setCategories(data)
    })
  }, [])

  useEffect(() => {
    setIsLoadingProducts(true)
    getProducts()
      .then(({ data }) => {
        if (data == null) {
          return
        }
        setProducts(data)
      })
      .finally(() => {
        setIsLoadingProducts(false)
      })
  }, [])

  const closeCreateProductModal = () => {
    setShowCreateProductModal(false)
  }

  return (
    <div>
      <div className='mb-4 flex justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>Productos</h2>
          <p className='text-sm text-neutral-600'>Inventario de productos.</p>
        </div>
        <div>
          <Button
            color='light'
            onClick={() => setShowCreateProductModal(true)}
          >
            <div className='flex items-center gap-1'>
              <span>Nuevo producto</span> <IoIosAdd size='24' />
            </div>
          </Button>
        </div>
      </div>
      <div className='rounded border bg-white'>
        <ProductsTable
          products={products}
          categories={categories}
          isLoading={isLoadingProducts}
        />
      </div>
      <CreateProductModal
        categories={categories}
        opened={showCreateProductModal}
        close={closeCreateProductModal}
      />
    </div>
  )
}
