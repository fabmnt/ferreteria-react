import { useParams } from 'wouter'
import { useEffect, useState } from 'react'
import { getProduct } from '../../services/products'
import { Button } from 'flowbite-react'


export function ProductInfo() {
  const { id } = useParams()
  const [product, setProduct] = useState({})

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await getProduct(id)
      if (error) throw error
      setProduct(data[0])
    }

    fetchProduct()
  }, [id])


  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>{product.name}</h2>
          <p className='text-sm text-neutral-600'> <span className='font-semibold text-black'>Descripción: </span> {product.description}</p>
          <p className='mb-3 text-sm text-neutral-600'> <span className='font-semibold text-black'>Marca: </span> {product.brand}</p>

          <table className='w-full table-fixed text-left text-sm'>
            <thead className='border-b text-xs'>
              <tr className='[&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:border-b [&>td]:px-2 [&>td]:align-middle'>
                <th className='w-[60px]'>#</th>
                <th className='px-4 py-2'>Categoría</th>
                <th className='px-4 py-2'>Precio de compra</th>
                <th className='px-4 py-2'>Precio de venta</th>
                <th className='px-4 py-2'>Descuento</th>
                <th className='px-4 py-2'>Existencia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>#{product.id}</td>
                <td className='px-4 py-2'>{product.category_id}</td>
                <td className='px-4 py-2'>C$ {product.cost}</td>
                <td className='px-4 py-2'>C$ {product.price}</td>
                <td className='px-4 py-2'>
                  {product.discount == null ? '0%' : `${product.discount}%`}
                </td>
                <td className='px-4 py-2'>{product.stock}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
            <Button className='w[120px] flex justify-end'
              color='light'
              size='sm'
            >Modificar producto</Button>
    </div>
  )
}
