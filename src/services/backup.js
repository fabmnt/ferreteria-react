import { supabase } from '../db/supabase'

export async function backup() {
  const tables = [
    'bills',
    'bill_products',
    'categories',
    'customers',
    'employees',
    'inventory',
    'inventory_adjustment',
    'order_products',
    'orders',
    'roles',
    'suppliers',
    'taxes',
  ]

  const data = {}
  const promises = tables.map((table) => supabase.from(table).select())
  const backup = await Promise.all(promises)
  for (const [index, response] of backup.entries()) {
    const tableName = tables[index]
    data[tableName] = response.data
  }

  return data
}

export async function restore(data) {
  const promises = []

  for (const table in data) {
    const tableRows = data[table].map((row) => {
      delete row.id
      return row
    })

    const promise = supabase.from(table).insert(tableRows)
    promises.push(promise)
  }

  try {
    await Promise.all(promises)
    return true
  } catch (e) {
    return false
  }
}
