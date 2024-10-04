import { supabase } from '../db/supabase'

export async function getCustomerByPhone(phone) {
  const { data, error } = await supabase.from('customers').select('*').eq('phone', phone)
  return { data, error }
}

export async function getCustomers(limit = 5) {
  const { data, error } = await supabase.from('customers').select('*').limit(limit)
  return { data, error }
}

export async function createCustomer(customer) {
  const { data, error } = await supabase.from('customers').insert(customer).select()
  return { data, error }
}
