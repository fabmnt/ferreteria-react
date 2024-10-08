import { supabase } from '../db/supabase'

export async function getProduct(productId) {}

export async function getProducts() {
  const { data, error } = await supabase.from('inventory').select('*')

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
