import { Button } from 'flowbite-react'
import { AiOutlineDelete } from 'react-icons/ai'

export function SuppliersTable({ suppliers, isLoading, onDeleteSupplier }) {
  return (
    <div className='scroll-bar mb-4 max-h-[450px] w-full overflow-auto'>
      <table className='w-full table-fixed text-left text-sm'>
        <thead className='border-b text-xs'>
          <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
            <th className='w-[60px]'>#</th>
            <th className='w-[180px]'>Nombre</th>
            <th className='w-[180px]'>Teléfono</th>
            <th className='w-[120px]'>Correo</th>
            <th>Dirección</th>
            <th>Categoría</th>
            <th className='w-[80px]' />
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td
                  colSpan='7'
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
          {suppliers.length === 0 && !isLoading && (
            <tr>
              <td
                colSpan='9'
                className='h-16 px-2 align-middle'
              >
                <div className='flex justify-center'>
                  <p className='text-neutral-500'>No se han registrado proveedores</p>
                </div>
              </td>
            </tr>
          )}
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className='[&>td]:h-16 [&>td]:overflow-clip [&>td]:border-b [&>td]:px-2 [&>td]:align-middle'
            >
              <td>
                <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                  #{supplier.id}
                </span>
              </td>
              <td>{supplier.name}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email ?? 'Sin correo'}</td>
              <td>{supplier.address}</td>
              <td>{supplier.categories.name}</td>
              <td>
                <Button
                  onClick={() => onDeleteSupplier(supplier.id)}
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
    </div>
  )
}
