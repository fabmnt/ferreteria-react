import { supabase } from '../db/supabase'

export async function logout() {
  const { error } = await supabase.auth.signOut()

  return { error }
}

export async function deleteUser(userId) {
  const { error } = await supabase.auth.admin.deleteUser(userId)

  return { error }
}
