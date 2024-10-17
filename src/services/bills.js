import { supabase } from '../db/supabase'

export async function createBill(billInfo) {
  const { data, error } = await supabase.from('bills').insert(billInfo).select()

  return { data, error }
}

export async function updateBillProducts(billId, products, billProducts) {
  const newRows = products.map((product) => ({
    product_id: product.id,
    bill_id: billId,
    quantity: product.quantity,
  }))

  const { error } = await supabase.from('bill_products').insert(newRows)

  if (error == null) {
    const newInvetoryProducts = billProducts.map((product) => {
      const productQuantity = products.find((p) => p.id === product.id).quantity
      return {
        ...product,
        stock: product.stock - productQuantity,
      }
    })
    const { error: upsertError } = await supabase.from('inventory').upsert(newInvetoryProducts)

    if (upsertError != null) {
      return { error: upsertError }
    }
  }

  return { error }
}
