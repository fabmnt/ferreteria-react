import { supabase } from '../db/supabase'

export async function getCustomerByPhone(phone) {
  const { data, error } = await supabase.from('customers').select('*').eq('phone', phone)
  return { data, error }
}

export async function getCustomers() {
  const { data, error } = await supabase.from('customers').select('*')
  return { data, error }
}
