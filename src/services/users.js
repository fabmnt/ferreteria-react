import { supabase } from '../db/supabase'

export async function getRoles() {
  const { data, error } = await supabase.from('roles').select('*')

  return { data, error }
}

export async function getEmployee(userId) {
  const { data, error } = await supabase
    .from('employees')
    .select(`id, user_id, name, last_name, roles (id, permissions, role)`)
    .eq('user_id', userId)

  return { data, error }
}
