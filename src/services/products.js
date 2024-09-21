import { supabase } from '../db/supabase'

export async function getProducts() {
  const { data, error } = await supabase.from('inventory').select('*')

  return { data, error }
}
