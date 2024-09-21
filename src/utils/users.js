export function hasRoles(employee, ...roles) {
  return roles.includes(employee?.roles.role)
}
