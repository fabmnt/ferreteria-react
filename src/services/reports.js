import { supabase } from '../db/supabase'

export const obtenerVentasPorCliente = async (fechaInicio, fechaFin) => {
  const { data, error } = await supabase
    .from('bills')
    .select(
      `
      id,
      created_at,
      total_sell,
      total_discount, 
      total_payed,
      customers (name, last_name)
    `,
    )
    .gte('created_at', fechaInicio)
    .lte('created_at', fechaFin)

  if (error) {
    console.error('Error obteniendo las ventas:', error)
    return null
  }

  return data
}

export const obtenerInventarioActual = async () => {
  const { data, error } = await supabase.from('inventory').select(`
      id,
      name,
      description,
      stock,
      price,
      cost,
      category_id (name)
    `)

  if (error) {
    console.error('Error obteniendo el inventario:', error)
    return null
  }

  return data
}

export const obtenerVentasPorProducto = async (fechaInicio, fechaFin) => {
  // Paso 1: Obtener las facturas con los productos
  const { data: billsData, error: billsError } = await supabase
    .from('bills')
    .select('id, created_at')
    .gte('created_at', fechaInicio)
    .lte('created_at', fechaFin)

  if (billsError) {
    console.error('Error obteniendo las facturas:', billsError)
    return null
  }

  // Paso 2: Obtener los productos de la tabla bill_products
  const { data: billProductsData, error: billProductsError } = await supabase
    .from('bill_products')
    .select('product_id, quantity, bill_id')
    .in(
      'bill_id',
      billsData.map((bill) => bill.id),
    ) // Filtrar las facturas por las que obtenemos productos

  if (billProductsError) {
    console.error('Error obteniendo los productos de las facturas:', billProductsError)
    return null
  }

  // Paso 3: Obtener los detalles de los productos
  const { data: productsData, error: productsError } = await supabase
    .from('inventory')
    .select('id, name, description, price, stock, category_id')

  if (productsError) {
    console.error('Error obteniendo los productos:', productsError)
    return null
  }

  // Paso 4: Procesar y combinar los datos
  const ventasPorProducto = productsData
    .map((product) => {
      const productosVendidos = billProductsData.filter((item) => item.product_id === product.id)

      const cantidadVendida = productosVendidos.reduce((acc, item) => acc + item.quantity, 0)
      const totalVentas = cantidadVendida * product.price
      const stockRestante = product.stock - cantidadVendida

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        cantidad_vendida: cantidadVendida,
        total_ventas: totalVentas,
        stock_restante: stockRestante,
      }
    })
    .filter((product) => product.cantidad_vendida > 0) // Filtrar productos con cantidad vendida mayor a 0

  // Ordenar por cantidad vendida más alta
  ventasPorProducto.sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)

  return ventasPorProducto
}

export const obtenerGananciasPorFecha = async (fechaInicio, fechaFin) => {
  // Convertir las fechas a formato ISO
  const fechaInicioISO = new Date(fechaInicio).toISOString()
  const fechaFinObj = new Date(fechaFin)
  fechaFinObj.setHours(23, 59, 59, 999)
  const fechaFinISO = fechaFinObj.toISOString()

  // Verificar las fechas en consola para depuración
  console.log('Fecha de inicio:', fechaInicioISO)
  console.log('Fecha de fin:', fechaFinISO)

  // Paso 1: Obtener las facturas en el rango de fechas
  const { data: billsData, error: billsError } = await supabase
    .from('bills')
    .select('id, created_at, total_payed')
    .gte('created_at', fechaInicioISO)
    .lte('created_at', fechaFinISO)

  if (billsError) {
    console.error('Error obteniendo las facturas:', billsError)
    return null
  }

  // Paso 2: Obtener los productos vendidos en esas facturas
  const { data: billProductsData, error: billProductsError } = await supabase
    .from('bill_products')
    .select('product_id, quantity, bill_id')
    .in(
      'bill_id',
      billsData.map((bill) => bill.id),
    )

  if (billProductsError) {
    console.error('Error obteniendo los productos de las facturas:', billProductsError)
    return null
  }

  // Paso 3: Obtener los detalles de los productos
  const { data: productsData, error: productsError } = await supabase
    .from('inventory')
    .select('id, name, price, cost')

  if (productsError) {
    console.error('Error obteniendo los productos:', productsError)
    return null
  }

  // Paso 4: Calcular ganancias, productos vendidos y total pagado por fecha
  const gananciasPorFecha = []

  // Agrupar las ventas por fecha
  billsData.forEach((bill) => {
    const productosVendidos = billProductsData.filter((item) => item.bill_id === bill.id)

    let gananciaTotal = 0
    let totalPagado = bill.total_payed
    let cantidadTotalVendida = 0

    productosVendidos.forEach((productoVenta) => {
      const producto = productsData.find((prod) => prod.id === productoVenta.product_id)

      if (producto) {
        const gananciaPorProducto = (producto.price - producto.cost) * productoVenta.quantity
        gananciaTotal += gananciaPorProducto
        cantidadTotalVendida += productoVenta.quantity
      }
    })

    const fechaFactura = new Date(bill.created_at).toLocaleDateString()

    const existenciaFecha = gananciasPorFecha.find((item) => item.fecha === fechaFactura)

    if (existenciaFecha) {
      existenciaFecha.cantidad_vendida += cantidadTotalVendida
      existenciaFecha.total_pagado += totalPagado
      existenciaFecha.ganancia_total += gananciaTotal
    } else {
      gananciasPorFecha.push({
        fecha: fechaFactura,
        cantidad_vendida: cantidadTotalVendida,
        total_pagado: totalPagado,
        ganancia_total: gananciaTotal,
      })
    }
  })

  return gananciasPorFecha
}
