import { useEffect, useState } from 'react'
import { getEmployees, getRoles } from '../../services/users'
import { UsersTable } from '../components/users-table'
import { useSessionStore } from '../../store/session'
import { useLocation } from 'wouter'

export function UsersPage() {
  const [employees, setEmployees] = useState([])
  const [roles, setRoles] = useState([])
  const [employeesStatus, setEmployeesStatus] = useState('loading')
  const [shouldRevalidate, revalidate] = useState(false)
  const employee = useSessionStore((state) => state.employee)
  const [, navigate] = useLocation()

  useEffect(() => {
    if (employee.roles.role !== 'admin') {
      navigate('/')
    }
  }, [employee])

  useEffect(() => {
    getRoles().then(({ data }) => {
      if (data == null) {
        return
      }
      setRoles(data)
    })

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

  // const handleUpdateEmployeeRole = async (employeeId, roleId) => {
  //   const { error } = await updateEmployeeRole(employeeId, roleId)

  //   if (error) {
  //     return
  //   }

  //   revalidate((r) => !r)
  // }

  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-3xl font-semibold'>Usuarios</h2>
          <p className='text-sm text-neutral-600'>Lista de usuarios del sistema.</p>
        </div>
      </div>
      <div className='w-full border bg-white'>
        <UsersTable
          isLoading={employeesStatus === 'loading'}
          employees={employees}
          revalidate={() => revalidate((prev) => !prev)}
          roles={roles}
        />
      </div>
    </div>
  )
}
