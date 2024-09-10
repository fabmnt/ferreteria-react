import { supabase } from '../db/supabase'

export async function getRoles () {
  const { data, error } = await supabase.from('roles').select('*')

  return { data, error }
}
