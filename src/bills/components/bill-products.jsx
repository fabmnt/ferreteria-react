import { IoIosAdd } from 'react-icons/io'
import { Input } from '../../components/input'

export function BillProducts({
  openAddProductModal,
  products,
  productsQuantity,
  updateProductsQuantity,
}) {
  const hanldeUpdateQuantity = (e, productId) => {
    e.preventDefault()
    const newQuantity = e.target.value
    const newProductsQuantity = { ...productsQuantity }
    const product = products.find((product) => product.id === productId)

    if (product == null) {
      return
    }

    const { stock } = product
    if (newQuantity > stock) {
      return
    }

    newProductsQuantity[productId] = +newQuantity
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
              <th>Precio</th>
              <th>Marca</th>
              <th>Cantidad</th>
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
                <td>C$ {product.price}</td>
                <td>{product.brand}</td>
                <td>
                  <Input
                    type='number'
                    min={1}
                    max={product.stock}
                    className='w-[6ch] px-2 py-1'
                    defaultValue={productsQuantity[product.id] ?? 1}
                    onInput={(e) => hanldeUpdateQuantity(e, product.id)}
                  />
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
