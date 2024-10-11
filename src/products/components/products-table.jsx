import { Button } from 'flowbite-react'
import { AiOutlineDelete } from 'react-icons/ai'
import { useLocation } from 'wouter'

export function ProductsTable({ products, categories, isLoading, onDeleteProduct }) {
  const [, navigate] = useLocation()

  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`)
  }

  const sliceDescription = (description) => {
    const maxDescriptionLength = 50
    if (description.length <= maxDescriptionLength) {
      return description
    }

    return description.slice(0, maxDescriptionLength) + '...'
  }

  const getCategoryById = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId)
    return category?.name ?? 'Sin categoría'
  }

  return (
    <table className='w-full table-fixed text-left text-sm'>
      <thead className='border-b text-xs'>
        <tr className='[&>th]:h-10 [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
          <th className='w-[60px]'>#</th>
          <th className='w-[180px]'>Nombre</th>
          <th className='w-[240px]'>Descripción</th>
          <th>Marca</th>
          <th className='w-[180px]'>Categoría</th>
          <th>Precio</th>
          <th>Descuento</th>
          <th>Existencias</th>
          <th className='w-[80px]' />
        </tr>
      </thead>
      <tbody>
        {isLoading &&
          Array.from({ length: 12 }).map((_, index) => (
            <tr key={index}>
              <td
                colSpan='9'
                className='h-16 px-2 align-middle'
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
            onClick={() => navigateToProduct(product.id)}
            key={product.id}
            className='hover:cursor-pointer hover:bg-neutral-100 [&>td]:h-16 [&>td]:overflow-clip [&>td]:border-b [&>td]:px-2 [&>td]:align-middle'
          >
            <td>
              <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                #{product.id}
              </span>
            </td>
            <td>{product.name}</td>
            <td className='overflow-clip'>{sliceDescription(product.description)}</td>
            <td>{product.brand}</td>
            <td>{getCategoryById(product.category_id)}</td>
            <td>C$ {product.price}</td>
            <td>{product.discount ?? 0}%</td>
            <td>{product.stock}</td>
            <td>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteProduct(product.id)
                }}
                color='light'
                size='sm'
              >
                <AiOutlineDelete className='h-6 w-5 text-red-700' />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
