import { useState } from 'react'
import { obtenerInventarioActual } from '../../services/reports'
import { Button } from 'flowbite-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

export function ReporteInventario() {
  const [inventario, setInventario] = useState([])

  const manejarCargarInventario = async () => {
    try {
      const data = await obtenerInventarioActual()
      console.log('Datos de inventario obtenidos:', data) // Verifica los datos obtenidos

      if (data) {
        setInventario(data)
        toast.success('Inventario cargado correctamente.')
      } else {
        console.error('No se obtuvieron datos de inventario.')
        toast.error('No se obtuvieron datos de inventario.')
      }
    } catch (error) {
      console.error('Error al cargar el inventario:', error)
      toast.error('Error al cargar el inventario.')
    }
  }

  const manejarExportarInventario = () => {
    if (inventario.length > 0) {
      const ws = XLSX.utils.json_to_sheet(
        inventario.map((item) => ({
          ID: item.id,
          Nombre: item.name,
          Descripción: item.description,
          Stock: item.stock,
          Costo: `C$${item.cost}`,
          Precio: `C$${item.price}`,
          Categoría: item.category_id.name,
        })),
      )

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario Actual')
      XLSX.writeFile(wb, 'reporte_inventario.xlsx')
    }
  }

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Reporte de Inventario Actual</h1>
      <div className='flex gap-4'>
        <Button
          onClick={manejarCargarInventario}
          color='blue'
        >
          Cargar Inventario
        </Button>
        <Button
          onClick={manejarExportarInventario}
          color='green'
          disabled={inventario.length === 0}
        >
          Exportar Inventario a Excel
        </Button>
      </div>

      {inventario.length > 0 ? (
        <div className='scroll-bar mb-4 mt-4 h-[310px] overflow-auto'>
          <table className='w-full table-fixed text-left text-sm'>
            <thead className='border-b text-xs'>
              <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                <th className='w-16 pl-4'>#</th>
                <th className='w-40'>Nombre</th>
                <th className='w-50'>Descripción</th>
                <th className='w-28'>Stock</th>
                <th className='w-28'>Costo</th>
                <th className='w-28'>Precio</th>
                <th className='w-36'>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr
                  key={item.id}
                  className='border-y [&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:px-2 [&>td]:align-middle'
                >
                  <td className='pl-4'>
                    <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                      #{item.id}
                    </span>
                  </td>
                  <td className=''>{item.name}</td>
                  <td className=''>{item.description}</td>
                  <td className=''>{item.stock}</td>
                  <td className=''>C${item.cost}</td>
                  <td className=''>C${item.price}</td>
                  <td className=''>{item.category_id.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='mt-4'>No hay datos de inventario disponibles.</p>
      )}
    </div>
  )
}
