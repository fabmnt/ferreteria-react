import { useState } from 'react'
import { obtenerVentasPorProducto } from '../../services/reports'
import { Button } from 'flowbite-react'
import * as XLSX from 'xlsx'

export function VentasPorProducto() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [ventasPorProducto, setVentasPorProducto] = useState([])

  const manejarSubmit = async (e) => {
    e.preventDefault()
    const fechaFinInclusive = new Date(fechaFin)
    fechaFinInclusive.setDate(fechaFinInclusive.getDate() + 1)
    fechaFinInclusive.setHours(23, 59, 59, 999)

    const data = await obtenerVentasPorProducto(fechaInicio, fechaFinInclusive.toISOString())
    setVentasPorProducto(data)
  }

  // Función para exportar a Excel
  const exportarAExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      ventasPorProducto.map((producto) => ({
        Producto: producto.name,
        CantidadVendida: producto.cantidad_vendida,
        TotalVentas: `C$${producto.total_ventas}`,
        StockRestante: producto.stock_restante,
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas por Producto')
    XLSX.writeFile(wb, 'reporte_ventas_producto.xlsx')
  }

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-semibold'>Reporte de Ventas por Producto</h1>
      <form
        className='mb-4'
        onSubmit={manejarSubmit}
      >
        <div className='flex items-center justify-around'>
          <div className='mb-2'>
            <label>Fecha Inicio:</label>
            <input
              type='date'
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className='rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
            />
          </div>
          <div className='mb-2'>
            <label>Fecha Fin:</label>
            <input
              type='date'
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className='rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
            />
          </div>
          <div className='mb-2'>
            <Button
              type='submit'
              color='blue'
              className='flex items-center'
            >
              Generar Reporte
            </Button>
          </div>
        </div>
      </form>

      <div>
        {ventasPorProducto.length > 0 ? (
          <>
            <div className='scroll-bar mb-4 h-[310px] overflow-auto'>
              <table className='w-full table-fixed text-left text-sm'>
                <thead className='border-b text-xs'>
                  <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                    <th className='w-16 pl-4'>#</th>
                    <th className='w-28'>Producto</th>
                    <th className='w-28'>Cantidad Vendida</th>
                    <th className='w-28'>Total Ventas</th>
                    <th className='w-28'>Stock Restante</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPorProducto.map((producto, index) => (
                    <tr
                      key={producto.id}
                      className='border-y [&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:px-2 [&>td]:align-middle'
                    >
                      <td className='pl-4'>
                        <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                          #{index + 1}
                        </span>
                      </td>
                      <td className='px-4 py-2'>{producto.name}</td>
                      <td className='px-4 py-2'>{producto.cantidad_vendida}</td>
                      <td className='px-4 py-2'>C${producto.total_ventas}</td>
                      <td className='px-4 py-2'>{producto.stock_restante}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              onClick={exportarAExcel}
              color='green'
              className='mt-4'
            >
              Exportar a Excel
            </Button>
          </>
        ) : (
          <p>No hay datos disponibles para las fechas seleccionadas.</p>
        )}
      </div>
    </div>
  )
}
