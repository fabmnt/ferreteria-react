import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getAllBillProducts } from '../../services/bills'
import { getMostSelledProudcts } from '../../utils/chart-data'

export function CustomTooltip({ active, payload, label }) {
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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#733f78', '#808080']

export function MostSelledProductsChart() {
  const [billProducts, setBillProducts] = useState([])

  useEffect(() => {
    getAllBillProducts().then(({ data, error }) => {
      if (error) {
        throw new Error(error.message)
      }
      setBillProducts(data)
    })
  }, [])

  const mostSelledProducts = getMostSelledProudcts(billProducts)

  return (
    <ResponsiveContainer
      width='100%'
      height='100%'
    >
      <PieChart>
        <Pie
          dataKey='quantity'
          fill='#8884d8'
          className='text-xs'
          labelLine={false}
          label={({ payload }) => payload.productName.substring(0, 16).concat('...')}
          data={mostSelledProducts}
        >
          {mostSelledProducts.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
