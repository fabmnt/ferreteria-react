import { IoIosAdd } from 'react-icons/io'

export function BillProducts({ openAddProductModal, products }) {
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
        <table className='sticky top-0 z-10 w-full table-auto border-b bg-white text-left'>
          <thead className='sticky top-0 z-10 border-b bg-white'>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Marca</th>
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
