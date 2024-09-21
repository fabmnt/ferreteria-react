import { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { useSessionStore } from '../../store/session'
import { deleteUser, logout } from '../../services/auth'
import { getEmployees, getRoles, updateEmployeeRole, verifyEmployee } from '../../services/users'

export function UsersPage() {
  const [employees, setEmployees] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [shouldRevalidate, revalidate] = useState(false)
  const [roles, setRoles] = useState([])
  const session = useSessionStore((state) => state.session)

  useEffect(() => {
    getEmployees().then(({ data }) => {
      if (data == null) {
        return
      }
      setEmployees([...data].sort((a, b) => a.id - b.id))
      const roles = data.map((employee) => ({ roleId: employee.roles.id, employeeId: employee.id }))
      setSelectedRoles(roles)
    })

    getRoles().then(({ data }) => {
      if (data == null) {
        return
      }
      setRoles(data)
    })
  }, [shouldRevalidate])

  const handleVerifyEmployee = async (employeeId) => {
    const { error } = await verifyEmployee(employeeId)

    if (error) {
      return
    }

    revalidate((r) => !r)
  }

  const handleUpdateEmployeeRole = async (employeeId, roleId) => {
    const { error } = await updateEmployeeRole(employeeId, roleId)

    if (error) {
      return
    }

    revalidate((r) => !r)
  }

  const handleDeleteEmployee = async (userId) => {
    const { error } = await deleteUser(userId)

    if (error) {
      return
    }

    if (userId === session.user.id) {
      await logout()
    }

    revalidate((r) => !r)
  }

  const getRoleByEmployeeId = (employeeId) => {
    const role = selectedRoles.find((role) => role.employeeId === employeeId)
    return role?.roleId
  }

  const updateEmployeeRoleState = (employeeId, roleId) => {
    const newSelectedRoles = selectedRoles.map((role) => {
      if (role.employeeId === employeeId) {
        return { ...role, roleId }
      }
      return role
    })
    setSelectedRoles(newSelectedRoles)
  }

  return (
    <div className='w-full pl-4'>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>Usuarios</h2>
        <p className='text-sm text-zinc-500'>Lista de los usuarios del sistema</p>
      </div>
      <table className='w-full table-auto text-left text-sm'>
        <thead className='border-b'>
          <tr>
            <th>#</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Fecha de creación</th>
            <th>Último inicio de sesión</th>
            <th>Acciones</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className='[&>td]:h-12 [&>td]:align-middle'
            >
              <td>
                <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                  #{employee.id}
                </span>
              </td>
              <td>
                {employee.name}{' '}
                {session.user.id === employee.user_id && (
                  <span className='font-semibold text-zinc-700'>(Tú)</span>
                )}
              </td>
              <td>{employee.last_name}</td>
              <td>{employee.email}</td>
              <td>
                <form className='mx-auto max-w-sm text-xs'>
                  <select
                    onChange={(e) => updateEmployeeRoleState(employee.id, e.target.value)}
                    value={getRoleByEmployeeId(employee.id)}
                    id='user-roles'
                    className='block rounded-lg border border-gray-300 bg-gray-50 p-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                  >
                    {roles.map((role) => (
                      <option
                        key={role.id}
                        value={role.id}
                      >
                        {role.role}
                      </option>
                    ))}
                  </select>
                </form>
              </td>
              <td>{new Date(employee.created_at).toDateString()}</td>
              <td>{new Date(session.user.last_sign_in_at).toDateString()}</td>
              <td>
                <div className='flex w-full justify-center'>
                  <button onClick={() => handleDeleteEmployee(employee.user_id)}>
                    <AiOutlineDelete className='h-6 w-5 text-red-700' />
                  </button>
                </div>
              </td>
              <td>
                {!employee.verified && (
                  <button
                    onClick={() => handleVerifyEmployee(employee.id)}
                    type='button'
                    className='rounded-lg bg-blue-700 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    Aceptar
                  </button>
                )}
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUpdateEmployeeRole(employee.id, getRoleByEmployeeId(employee.id))
                  }
                  type='button'
                  className={`rounded-lg bg-green-700 px-2 py-1.5 text-xs font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ${Number(getRoleByEmployeeId(employee.id)) !== employee.roles.id ? 'visible' : 'invisible'}`}
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
