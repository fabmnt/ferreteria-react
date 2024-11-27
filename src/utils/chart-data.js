import { subDays } from 'date-fns'

export function getSellsInformationLast15Days(bills) {
  const today = new Date() // Fecha actual
  const sinceDate = subDays(today, 15) // Restamos 15 días desde hoy

  // Filtramos las facturas de los últimos 15 días
  const filteredBills = bills.filter((bill) => new Date(bill.created_at) >= sinceDate)

  // Preparamos un array para agrupar las facturas día por día
  const result = []

  for (let i = 0; i <= 15; i++) {
    const currentDate = new Date(sinceDate)
    currentDate.setDate(sinceDate.getDate() + i) // Iteramos día por día

    // Filtramos las facturas del día actual
    const sellsFromCurrentDate = filteredBills.filter(
      (bill) => new Date(bill.created_at).toLocaleDateString() === currentDate.toLocaleDateString(),
    )

    // Agregamos los datos al resultado
    result.push({
      date: currentDate.toLocaleDateString(), // Fecha actual en formato legible
      sells: sellsFromCurrentDate.length, // Número de facturas
      total: sellsFromCurrentDate.reduce((acc, bill) => acc + bill.total_payed, 0), // Total vendido
    })
  }

  return result
}

export function getMostSelledProudcts(billProducts) {
  const result = []

  for (const billProduct of billProducts) {
    const product = result.find((item) => item.productId === billProduct.inventory.id)

    if (product) {
      product.quantity += billProduct.quantity
    } else {
      result.push({
        productId: billProduct.inventory.id,
        productName: billProduct.inventory.name,
        quantity: billProduct.quantity,
      })
    }
  }

  result.sort((a, b) => b.quantity - a.quantity)
  const mostSelledProducts = result.slice(0, 5)
  const restProducts = result.slice(5)
  const total = restProducts.reduce((acc, item) => acc + item.quantity, 0)
  mostSelledProducts.push({
    productId: 'rest',
    productName: 'Otros',
    quantity: total,
  })

  return mostSelledProducts
}
