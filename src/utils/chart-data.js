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
