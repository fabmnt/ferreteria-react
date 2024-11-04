import { differenceInDays } from 'date-fns'

export function getSellsInformationByDate(bills, dateFrom) {
  const sinceDate = new Date(dateFrom)
  const filteredBills = bills.filter((bill) => new Date(bill.created_at) >= sinceDate)
  const daysDifference = differenceInDays(new Date(), sinceDate)
  const result = []

  for (let i = 0; i < daysDifference + 1; i++) {
    if (i === 0) {
      sinceDate.setDate(sinceDate.getDate())
    } else {
      sinceDate.setDate(sinceDate.getDate() + 1)
    }
    const sellsFromCurrentDate = filteredBills.filter((bill) => {
      return new Date(bill.created_at).toLocaleDateString() === sinceDate.toLocaleDateString()
    })
    result.push({
      date: new Date(sinceDate).toLocaleDateString(),
      sells: sellsFromCurrentDate.length,
      total: sellsFromCurrentDate.reduce((acc, bill) => acc + bill.total_payed, 0),
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
