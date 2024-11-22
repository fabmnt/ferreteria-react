import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getAllBillProducts } from '../../services/bills'
import { getMostSelledProudcts } from '../../utils/chart-data'

export function CustomTooltip({ active, payload }) {
  if (active) {
    return (
      <div className='rounded bg-white p-2 shadow'>
        <p className='text-sm'>{`Producto: ${payload[0].payload.productName}`}</p>
        <p className='text-sm text-[#8884d8]'>{`Cantidad: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

const COLORS = ['#2898ee', '#107acc', '#0cbccc', '#15297c', '#142157', '#8da9c4']
const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
      fontSize={12}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

export function MostSelledProductsChart() {
  const [billProducts, setBillProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getAllBillProducts()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }
        setBillProducts(data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const mostSelledProducts = getMostSelledProudcts(billProducts)

  return isLoading ? (
    <div className='h-full w-full animate-pulse rounded-md bg-neutral-100' />
  ) : (
    <ResponsiveContainer
      width='100%'
      height='100%'
    >
      <PieChart>
        <Pie
          className='text-sm'
          dataKey='quantity'
          fill='#8884d8'
          labelLine={false}
          label={({ payload }) => payload.productName.substring(0, 16).concat('...')}
          data={mostSelledProducts}
          outerRadius='80%'
        >
          {mostSelledProducts.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Pie
          dataKey='quantity'
          data={mostSelledProducts}
          innerRadius='40%'
          outerRadius='80%'
          fill='transparent'
          label={renderCustomizedLabel}
        />
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
