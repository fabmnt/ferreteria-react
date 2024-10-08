import { Button } from 'flowbite-react'
import { IoIosAdd } from 'react-icons/io'
import { ProductsTable } from '../components/products-table'
import { useEffect, useState, useRef } from 'react'
import { getCategories, getProducts } from '../../services/products'
import { CreateProductModal } from '../components/create-product-modal'
import { ProductsFilters } from '../components/products-filters'

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showCreateProductModal, setShowCreateProductModal] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 0,
  })
  const originalProducts = useRef([])

  useEffect(() => {
    getCategories().then(({ data }) => {
      if (data == null) {
        return
      }
      setCategories(data)
    })
  }, [])

  useEffect(() => {
    const { search, minPrice, maxPrice, category } = filters
    console.log('filters', filters)
    const filteredProducts = originalProducts.current.filter((product) => {
      const productName = product.name.toLowerCase()
      const productBrand = product.brand.toLowerCase()
      const isSearchValid = productName.includes(search) || productBrand.includes(search)
      const isPriceValid = product.price >= minPrice && product.price <= maxPrice
      const isCategoryValid = category === '' || product.category_id === +category

      return isSearchValid && isPriceValid && isCategoryValid
    })

    setProducts(filteredProducts)
  }, [filters])

  useEffect(() => {
    setIsLoadingProducts(true)
    getProducts()
      .then(({ data }) => {
        if (data == null) {
          return
        }
        const maxPrice = Math.max(...data.map((product) => product.price))
        setFilters((prevFilters) => ({ ...prevFilters, maxPrice }))
        setProducts(data)
        originalProducts.current = data
      })
      .finally(() => {
        setIsLoadingProducts(false)
      })
  }, [])

  const closeCreateProductModal = () => {
    setShowCreateProductModal(false)
  }

  const handleUpdateFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))
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
        <div>
          <ProductsFilters
            categories={categories}
            onUpdateFilters={handleUpdateFilters}
            filters={filters}
          />
        </div>

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
