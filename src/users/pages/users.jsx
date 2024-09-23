import { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Badge } from '../../components/badge'
import { deleteUser, logout } from '../../services/auth'
import { getEmployees } from '../../services/users'
import { useSessionStore } from '../../store/session'

export function UsersPage() {
  const [employees, setEmployees] = useState([])
  const [employeesStatus, setEmployeesStatus] = useState('idle')
  const [shouldRevalidate, revalidate] = useState(false)
  const session = useSessionStore((state) => state.session)

  useEffect(() => {
    setEmployeesStatus('loading')
    getEmployees()
      .then(({ data }) => {
        if (data == null) {
          return
        }
        setEmployees([...data].sort((a, b) => a.id - b.id))
      })
      .finally(() => {
        setEmployeesStatus('completed')
      })
  }, [shouldRevalidate])

  const rolesTranslated = {
    admin: 'Administrador',
    seller: 'Vendedor',
    guest: 'Invitado',
  }

  // const handleVerifyEmployee = async (employeeId) => {
  //   const { error } = await verifyEmployee(employeeId)

  //   if (error) {
  //     return
  //   }

  //   revalidate((r) => !r)
  // }

  // const handleUpdateEmployeeRole = async (employeeId, roleId) => {
  //   const { error } = await updateEmployeeRole(employeeId, roleId)

  //   if (error) {
  //     return
  //   }

  //   revalidate((r) => !r)
  // }

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

  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-3xl font-semibold'>Usuarios</h2>
          <p className='text-sm text-neutral-600'>Lista de usuarios del sistema.</p>
        </div>
      </div>
      <div className='w-full border bg-white'>
        <table className='w-full table-fixed text-left text-sm'>
          <thead className='border-b'>
            <tr className='[&>th]:h-10 [&>th]:font-normal [&>th]:text-neutral-600'>
              <th className='w-20 pl-4'>#</th>
              <th className='w-[15ch]'>Nombres</th>
              <th className='w-[15ch]'>Apellidos</th>
              <th className='w-[25ch]'>Correo</th>
              <th className='w-28'>Estado</th>
              <th className='w-28'>Rol</th>
              <th className='w-44'>Fecha de creación</th>
              <th className='w-44'>Último inicio de sesión</th>
              <th className=''>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employeesStatus === 'loading' &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className='h-16 pl-4'>
                    <div className='h-6 w-12 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 w-24 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 w-24 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                  <td className='h-16'>
                    <div className='h-6 w-16 animate-pulse rounded-lg bg-gray-200' />
                  </td>
                </tr>
              ))}

            {employees.map((employee) => (
              <tr
                key={employee.id}
                className='border-y [&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:align-middle'
              >
                <td className='pl-4'>
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
                <td className=''>{employee.email}</td>
                <td>
                  {employee.verified ? (
                    <Badge variant='success'>Verificado</Badge>
                  ) : (
                    <Badge variant='danger'>No verificado</Badge>
                  )}
                </td>
                <td>{rolesTranslated[employee.roles.role]}</td>
                <td>{new Date(employee.created_at).toDateString()}</td>
                <td className=''>{new Date(session.user.last_sign_in_at).toDateString()}</td>
                <td className=''>
                  <div className='flex gap-4'>
                    <button
                      className='flex items-center gap-2 text-red-700 underline-offset-2 hover:underline'
                      onClick={() => handleDeleteEmployee(employee.user_id)}
                    >
                      <AiOutlineDelete className='h-6 w-5 text-red-700' />
                    </button>
                    <button>
                      <BsThreeDotsVertical className='h-6 w-5' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
