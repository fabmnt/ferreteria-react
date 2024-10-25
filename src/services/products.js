import { supabase } from '../db/supabase'

export async function getProduct(productId) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, suppliers (*)')
    .eq('id', productId)

  return { data, error }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, suppliers (*), categories (*)')

  return { data, error }
}

export async function getTaxes() {
  const { data, error } = await supabase.from('taxes').select('*')

  return { data, error }
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*')

  return { data, error }
}

export async function createProduct(product) {
  const { data, error } = await supabase.from('inventory').insert(product).select('*')

  return { data, error }
}

export async function updateProduct(product) {
  const { data, error } = await supabase
    .from('inventory')
    .update(product)
    .eq('id', product.id)
    .select('*, suppliers (*)')

  return { data, error }
}

export async function deleteProduct(productId) {
  const { error } = await supabase.from('inventory').delete().eq('id', productId)

  return { error }
}

export async function createPurchaseOrder(order) {
  const { error, data } = await supabase.from('orders').insert(order).select('*')

  return { error, data }
}

export async function createOrderProducts(productsIDsWithQuantity, products) {
  const { error } = await supabase.from('order_products').insert(productsIDsWithQuantity)

  if (error) {
    return { error }
  }

  const newProducts = products
    .map((product) => ({
      ...product,
      stock:
        product.stock +
          productsIDsWithQuantity.find((p) => p.product_id === product.id)?.quantity ?? 1,
    }))
    .map((product) => {
      delete product.suppliers
      delete product.categories
      return product
    })

  console.log({ newProducts })

  const { error: updateProductsError } = await supabase.from('inventory').upsert(newProducts)

  return { updateProductsError }
}

export async function getSuppliers() {
  const { data, error } = await supabase.from('suppliers').select('*, categories (*)')

  return { data, error }
}

export async function deleteSupplier(supplierId) {
  const { error } = await supabase.from('suppliers').delete().eq('id', supplierId)

  return { error }
}

export async function createSupplier(supplier) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select('*, categories (*)')

  return { data, error }
}
