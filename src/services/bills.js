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
      delete product.categories
      delete product.suppliers
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

export async function getBills() {
  const { data, error } = await supabase.from('bills').select('*, customers (*), employees (*)')

  return { data, error }
}

export async function getTotalProductsBilled(billId) {
  const { count, error } = await supabase
    .from('bill_products')
    .select('*', { count: 'exact' })
    .eq('bill_id', billId)

  return { count, error }
}

export async function deleteBill(billId) {
  const { error } = await supabase.from('bills').delete().eq('id', billId)

  return { error }
}

export async function getBill(billId) {
  const {
    data: [bill],
    error,
  } = await supabase.from('bills').select('*, customers (*), employees (*)').eq('id', billId)

  return { data: bill, error }
}

export async function getBillProducts(billId) {
  const { data, error } = await supabase
    .from('bill_products')
    .select('*, inventory (*, categories (*))')
    .eq('bill_id', billId)

  return { data, error }
}

export async function getAllBillProducts() {
  const { data, error } = await supabase.from('bill_products').select('*, inventory (*)')

  return { data, error }
}
