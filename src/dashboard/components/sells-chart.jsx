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
import { getSellsInformationLast15Days } from '../../utils/chart-data'

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

  const sellInformationByDate = getSellsInformationLast15Days(bills)

  function CustomTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className='rounded bg-white dark:bg-neutral-800 p-2 shadow'>
          <p className='text-sm text-neutral-800 dark:text-white'>{`Fecha: ${label}`}</p>
          <p className='text-sm text-[#107acc]'>{`Total: C$ ${payload[0].value}`}</p>
        </div>
      )
    }

    return null
  }

  return isLoading ? (
    <div className='h-full w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-700' />
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
        <CartesianGrid strokeDasharray='3 3' className='dark:stroke-neutral-700' />
        <XAxis
          dataKey='date'
          className='text-xs text-neutral-800 dark:text-white'
        />
        <YAxis
          className='text-xs text-neutral-800 dark:text-white'
        >
          <Label
            value='Total (C$)'
            angle={-90}
            position='insideLeft'
            style={{ textAnchor: 'middle' }}
            className='text-neutral-800 dark:text-white'
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey='total'
          fill='var(--bar-color)'
          barSize={10}
          label={({ payload }) => `C$${payload}`}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
