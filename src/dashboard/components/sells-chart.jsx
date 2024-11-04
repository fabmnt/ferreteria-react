import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'
import { getBills } from '../../services/bills'
import { getSellsInformationByDate } from '../../utils/chart-data'

export function SellsChart({ sinceDate }) {
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getBills()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setBills(data)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const sellInformationByDate = getSellsInformationByDate(bills, '10/20/2024')

  function CustomTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className='rounded bg-white p-2 shadow'>
          <p className='text-sm'>{`Fecha: ${label}`}</p>
          <p className='text-sm text-[#8884d8]'>{`Total: C$ ${payload[0].value}`}</p>
        </div>
      )
    }

    return null
  }

  return isLoading ? (
    <div className='h-full w-full animate-pulse rounded-md bg-neutral-100' />
  ) : (
    <ResponsiveContainer
      width='100%'
      height='100%'
    >
      <BarChart
        data={sellInformationByDate}
        width={800}
        height={200}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='date'
          className='text-xs'
        />
        <YAxis
          className='text-xs'
          // tickFormatter={(value) => `C$${value}`}
        >
          <Label
            value='Total (C$)'
            angle={-90}
            position='insideLeft'
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey='total'
          fill='#8884d8'
          barSize={10}
          label={({ payload }) => `C$${payload}`}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
