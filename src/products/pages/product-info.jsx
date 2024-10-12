import { Button } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { useParams, useLocation } from 'wouter'
import { Skeleton } from '../../components/skeleton'
import { deleteProduct, getCategories, getProduct } from '../../services/products'
import { DeleteProductWarning } from '../components/delete-product-warning'
import { EditProductModal } from '../components/edit-product-modal'
import { toast } from 'sonner'

export function ProductInfo() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [, navigate] = useLocation()

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await getProduct(id)
      if (error) throw error
      setProduct(data[0])
    }
    setIsLoading(true)
    fetchProduct().finally(() => {
      setIsLoading(false)
    })
  }, [id])

  useEffect(() => {
    getCategories().then(({ data }) => {
      setCategories(data)
    })
  }, [])

  const findCategory = (id) => {
    return categories.find((category) => category.id === id)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  const handleUpdateProduct = (updatedProduct) => {
    setProduct(updatedProduct)
  }

  const handleDeleteProduct = () => {
    if (product == null) {
      return
    }

    setIsDeleting(true)
    deleteProduct(product.id)
      .then(({ error }) => {
        if (error) {
          throw new Error(error.message)
        }
        toast.success('Producto eliminado exitosamente.')
      })
      .catch(() => {
        toast.error('Ocurrió un error al eliminar el producto, inténtelo más tarde.')
      })
      .finally(() => {
        setIsDeleting(false)
        setShowDeleteModal(false)
        navigate('/products')
      })
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <div className='mb-4 flex flex-col'>
          {isLoading && <Skeleton className='w-60' />}
          {isLoading && <Skeleton className='w-32' />}
          {product != null && (
            <h2 className='text-2xl font-semibold'>
              {product.name}
              {product.stock === 0 && (
                <span className='ml-2 text-sm text-red-600'>Sin existencias</span>
              )}
            </h2>
          )}
          {product != null && <p className='text-sm text-neutral-600'>{product.brand}</p>}
        </div>
        <div>
          <div className='flex gap-2'>
            <Button
              onClick={() => setShowEditModal(true)}
              className=''
              color='light'
            >
              <div className='flex items-center'>
                Modificar producto
                <CiEdit
                  size={24}
                  className='ml-2'
                />
              </div>
            </Button>
            <Button
              color='light'
              size='sm'
              onClick={() => setShowDeleteModal(true)}
            >
              <div className='flex items-center justify-center'>
                <AiOutlineDelete className='h-6 w-5 text-red-700' />
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className='mb-8'>
        <hr className='mb-2' />
        {isLoading && <Skeleton />}
        {product != null && <p className='text-sm text-neutral-900'> {product.description}</p>}
      </div>
      {product != null && (
        <section className='grid w-full grid-cols-4 gap-8 text-sm [&>div]:rounded [&>div]:border [&>div]:bg-white [&>div]:p-4'>
          <div className='flex flex-col gap-1'>
            ID del producto:<strong className='font-semibold'>#{product.id}</strong>
          </div>
          <div className='flex flex-col gap-1'>
            Categoría:{' '}
            <strong className='font-semibold'>{findCategory(product.category_id)?.name}</strong>
          </div>
          <div className='flex flex-col gap-1'>
            Precio de compra: <strong className='font-semibold'>C${product.cost}</strong>
          </div>
          <div className='flex flex-col gap-1'>
            Precio de venta: <strong className='font-semibold'>C${product.price}</strong>
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            Descuento:{' '}
            <strong className='font-semibold'>
              {product.discount == null ? '0' : `${product.discount}`}%
            </strong>
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            Existencias: <strong className='font-semibold'>{product.stock}</strong>
          </div>
        </section>
      )}
      {product != null && (
        <EditProductModal
          opened={showEditModal}
          close={handleCloseEditModal}
          product={product}
          categories={categories}
          onUpdateProduct={handleUpdateProduct}
        />
      )}

      {product != null && (
        <DeleteProductWarning
          close={() => setShowDeleteModal(false)}
          show={showDeleteModal}
          isDeleting={isDeleting}
          onDeleteProduct={handleDeleteProduct}
          productId={product.id}
        />
      )}
    </div>
  )
}
