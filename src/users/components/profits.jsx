import { useState } from 'react'
import { Button } from 'flowbite-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { obtenerGananciasPorFecha } from '../../services/reports'

export function ReporteGananciasPorFecha() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [gananciasPorFecha, setGananciasPorFecha] = useState([])

  const manejarSubmit = async (e) => {
    e.preventDefault()

    if (!fechaInicio || !fechaFin) {
      toast.warning('Por favor, selecciona un rango de fechas.')
      return
    }

    if (fechaInicio > fechaFin) {
      toast.warning('La fecha de inicio no puede ser mayor a la fecha de fin.')
      return
    }

    const fechaFinInclusive = new Date(fechaFin)
    fechaFinInclusive.setDate(fechaFinInclusive.getDate() + 1)
    fechaFinInclusive.setHours(23, 59, 59, 999)

    const ganancias = await obtenerGananciasPorFecha(fechaInicio, fechaFinInclusive.toISOString())
    setGananciasPorFecha(ganancias)

    if (fechaInicio || fechaFin) {
      toast.success('Reporte obtenido correctamente.')
    }
  }

  const exportarAExcel = () => {
    if (gananciasPorFecha.length === 0) {
      toast.error('No hay datos para exportar.')
      return
    }

    // Preparar los datos para exportar
    const datosExcel = gananciasPorFecha.map((item) => ({
      'Fecha': item.fecha,
      'Artículos Vendidos': item.cantidad_vendida,
      'Total Pagado (C$)': item.total_pagado.toFixed(2),
      'Ganancia (C$)': item.ganancia_total.toFixed(2),
    }))

    // Crear la hoja de Excel
    const hoja = XLSX.utils.json_to_sheet(datosExcel)

    // Crear el libro de Excel y añadir la hoja
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, 'Ganancias')

    // Descargar el archivo
    XLSX.writeFile(libro, 'reporte_ganancias_por_fecha.xlsx')
  }

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-semibold'>Reporte de Ganancias por Fecha</h1>
      <form
        className='mb-4'
        onSubmit={manejarSubmit}
      >
        <div className='flex items-center justify-around'>
          <div className='mb-4'>
            <label htmlFor='fechaInicio'>Fecha Inicio: </label>
            <input
              type='date'
              id='fechaInicio'
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className='rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='fechaFin'>Fecha Fin: </label>
            <input
              type='date'
              id='fechaFin'
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
              Obtener Reporte
            </Button>
          </div>
        </div>
      </form>
      <div>
        {gananciasPorFecha.length > 0 ? (
          <>
            <div className='scroll-bar mb-4 h-[310px] overflow-auto'>
              <table className='w-full table-fixed text-left text-sm'>
                <thead className='border-b text-xs'>
                  <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:bg-white [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
                    <th className='w-28'>Fecha</th>
                    <th className='w-28'>Artículos Vendidos</th>
                    <th className='w-28'>Total Pagado (C$)</th>
                    <th className='w-28'>Ganancia (C$)</th>
                  </tr>
                </thead>
                <tbody>
                  {gananciasPorFecha.map((item) => (
                    <tr
                      key={item.fecha}
                      className='border-y [&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:px-2 [&>td]:align-middle'
                    >
                      <td>{item.fecha}</td>
                      <td>{item.cantidad_vendida}</td>
                      <td>{`C$${item.total_pagado.toFixed(2)}`}</td>
                      <td>{`C$${item.ganancia_total.toFixed(2)}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              color='green'
              onClick={exportarAExcel}
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
