import { useState } from 'react'
import { obtenerVentasPorCliente } from '../../services/reports'
import { Button } from 'flowbite-react'
import * as XLSX from 'xlsx'

const ReporteVentas = () => {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [ventas, setVentas] = useState([])

  const manejarSubmit = async (e) => {
    e.preventDefault()
    const fechaFinInclusive = new Date(fechaFin)
    fechaFinInclusive.setDate(fechaFinInclusive.getDate() + 1)
    fechaFinInclusive.setHours(23, 59, 59, 999)
    const data = await obtenerVentasPorCliente(
      fechaInicio,
      fechaFinInclusive.toISOString(),
    )
    console.log('Datos obtenidos:', data) // Verifica lo que retorna
    const sortedData = data.sort((a, b) => a.id - b.id)
    setVentas(sortedData)
  }

  // Función para exportar a Excel
  const exportarAExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      ventas.map((bills) => ({
        ID: bills.id,
        Cliente: `${bills.customers.name} ${bills.customers.last_name}`,
        Fecha: bills.created_at,
        Total: `C$${bills.total_payed}`,
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas por Cliente')
    XLSX.writeFile(wb, 'reporte_ventas.xlsx')
  }

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Reporte de Ventas por Cliente</h1>
      <form
        className='mb-4'
        onSubmit={manejarSubmit}
      >
        <div className='flex justify-around'>
          <div className='mb-2'>
            <label>Fecha Inicio:</label>
            <input
              type='date'
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className=''
            />
          </div>
          <div className='mb-2'>
            <label>Fecha Fin:</label>
            <input
              type='date'
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className=''
            />
          </div>
          <Button
            type='submit'
            color='light'
            className='flex items-center'
          >
            Generar Reporte
          </Button>
        </div>
      </form>

      <div>
        {ventas.length > 0 ? (
          <>
            <div className='scroll-bar mb-4 h-[350px] overflow-auto'>
              <table className='w-full table-fixed text-left text-sm'>
                <thead className='border-b text-xs'>
                  <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                    <th className='w-16 pl-4'>#</th>
                    <th className='w-28'>Cliente</th>
                    <th className='w-28'>Fecha de compra</th>
                    <th className='w-28'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((bills) => (
                    <tr
                      key={bills.id}
                      className='border-y [&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:px-2 [&>td]:align-middle'
                    >
                      <td className='pl-4'>
                        <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                          #{bills.id}
                        </span>
                      </td>
                      <td className='px-4 py-2'>
                        {bills.customers.name} {bills.customers.last_name}
                      </td>
                      <td className='px-4 py-2'>{new Date(bills.created_at).toDateString()}</td>
                      <td className='px-4 py-2'>C${bills.total_payed}</td>
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

export default ReporteVentas
