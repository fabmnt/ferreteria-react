import { supabase } from '../db/supabase'

export async function getRoles() {
  const { data, error } = await supabase.from('roles').select('*')

  return { data, error }
}

export async function getEmployee(userId) {
  const { data, error } = await supabase
    .from('employees')
    .select(`id, user_id, name, last_name, verified, roles (id, permissions, role)`)
    .eq('user_id', userId)

  return { data, error }
}

export async function getEmployees() {
  const { data, error, count } = await supabase
    .from('employees')
    .select(
      'id, user_id, name, last_name, created_at, verified, email, roles (id, permissions, role)',
    )

  return { data, error, count }
}

export async function verifyEmployee(employeeId) {
  const { error } = await supabase.from('employees').update({ verified: true }).eq('id', employeeId)

  return { error }
}

export async function deleteEmployee(employeeId) {
  const { error } = await supabase.from('employees').delete().eq('id', employeeId)
  return { error }
}

export async function updateEmployeeRole(employeeId, roleId) {
  const { error } = await supabase
    .from('employees')
    .update({ role_id: roleId })
    .eq('id', employeeId)

  return { error }
}

export async function createEmployee(employee) {
  const { data, error } = await supabase.from('employees').insert([employee])

  return { data, error }
}
