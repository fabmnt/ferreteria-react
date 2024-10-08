import { supabase } from '../db/supabase'

export async function getCustomerByPhone(phone) {
  const { data, error } = await supabase.from('customers').select('*').eq('phone', phone)
  return { data, error }
}

export async function getCustomers() {
  const { data, error } = await supabase.from('customers').select('*')
  return { data, error }
}

export async function createCustomer(customer) {
  const { data, error } = await supabase.from('customers').insert(customer).select()
  return { data, error }
}

export async function updateCustomerLastBuy(customerId, lastBuy) {
  const { data, error } = await supabase
    .from('customers')
    .update({ last_buy: lastBuy })
    .eq('id', customerId)
    .select('*')

  return { data, error }
}
