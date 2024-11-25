import { useState } from 'react'
import { obtenerGanancias } from '../../services/reports'
import { Button } from 'flowbite-react'
import * as XLSX from 'xlsx'

export function ReporteGanancias() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [ganancias, setGanancias] = useState(0)

  const manejarSubmit = async (e) => {
    e.preventDefault()

    const fechaFinInclusive = new Date(fechaFin)
    fechaFinInclusive.setDate(fechaFinInclusive.getDate() + 1)
    fechaFinInclusive.setHours(23, 59, 59, 999)

    const data = await obtenerGanancias(fechaInicio, fechaFinInclusive.toISOString())
    console.log('Ganancias obtenidas:', data)

    setGanancias(data)
  }

  // Función para exportar las ganancias a Excel
  const exportarAGananciasExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Total Ganancias": `C$${ganancias}`,
      },
    ])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ganancias Totales')
    XLSX.writeFile(wb, 'reporte_ganancias.xlsx')
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Reporte de Ganancias Totales</h1>
      <form className="mb-4" onSubmit={manejarSubmit}>
        <div className="flex justify-around">
          <div className="mb-2">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className=""
            />
          </div>
          <div className="mb-2">
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className=""
            />
          </div>
          <Button type="submit" color="light" className="flex items-center">
            Generar Reporte
          </Button>
        </div>
      </form>

      <div>
        {ganancias > 0 ? (
          <div>
            <p className="font-semibold text-lg">Ganancias Totales: C${ganancias}</p>
            <Button onClick={exportarAGananciasExcel} color="green" className="mt-4">
              Exportar a Excel
            </Button>
          </div>
        ) : (
          <p>No hay ganancias para las fechas seleccionadas.</p>
        )}
      </div>
    </div>
  )
}

