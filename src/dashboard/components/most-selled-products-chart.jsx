import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getAllBillProducts } from '../../services/bills'
import { getMostSelledProudcts } from '../../utils/chart-data'

export function CustomTooltip({ active, payload }) {
  if (active) {
    return (
      <div className='rounded bg-white dark:bg-neutral-800 p-2 shadow'>
        <p className='text-sm text-neutral-800 dark:text-white'>{`Producto: ${payload[0].payload.productName}`}</p>
        <p className='text-sm text-[#8884d8]'>{`Cantidad: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

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
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Detectar si el modo oscuro está activado
    setIsDarkMode(document.body.classList.contains('dark'))

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

  // Definimos los colores según el modo oscuro
  const lightColors = ['#2898ee', '#107acc', '#0cbccc', '#15297c', '#142157', '#008']
  const darkColors = ['#6c9cd7', '#457bb1', '#1a7b8c', '#3c4e8f', '#2d3f6d', '#5b7d9c']

  // Usamos el arreglo de colores basado en el modo
  const COLORS = isDarkMode ? darkColors : lightColors

  return isLoading ? (
    <div className='h-full w-full animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-700' />
  ) : (
    <ResponsiveContainer
      width='100%'
      height='100%'
    >
      <PieChart>
        <Pie
          className='text-sm'
          dataKey='quantity'
          fill={isDarkMode ? '#3c4e8f' : '#8884d8'} // Color base para el gráfico
          labelLine={false}
          label={({ payload }) => payload.productName.substring(0, 16).concat('...')}
          data={mostSelledProducts}
          outerRadius='80%'
        >
          {mostSelledProducts.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]} // Asigna el color según el modo
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
