import { supabase } from '../db/supabase'

export async function createBill(billInfo) {
  const { data, error } = await supabase.from('bills').insert(billInfo).select()

  return { data, error }
}

export async function updateBillProducts(billId, products) {
  const newRows = products.map((product) => ({
    product_id: product.id,
    bill_id: billId,
    quantity: product.quantity,
  }))

  const { error } = await supabase.from('bill_products').insert(newRows)

  return { error }
}
