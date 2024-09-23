import { supabase } from '../db/supabase'

export async function logout() {
  const { error } = await supabase.auth.signOut()

  return { error }
}

export async function deleteUser(userId) {
  const { error } = await supabase.auth.admin.deleteUser(userId)

  return { error }
}

export async function signIn(email, password) {
  const { error, data } = await supabase.auth.signInWithPassword({ email, password })

  return { error, data }
}

export async function signUp(email, password) {
  const { error, data } = await supabase.auth.signUp({ email, password })

  return { error, data }
}
