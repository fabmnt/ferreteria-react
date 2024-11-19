import { Button, Spinner, Tabs } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { GoDatabase } from 'react-icons/go'
import { HiUserCircle } from 'react-icons/hi'
import { useLocation } from 'wouter'
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs'
import { backup } from '../../services/backup'
import { getEmployees, getRoles } from '../../services/users'
import { useSessionStore } from '../../store/session'
import { downloadJSON } from '../../utils/utils'
import { BackUpRestore } from '../components/backup-restore'
import { UsersTable } from '../components/users-table'
import { MdOutlineFileDownload } from 'react-icons/md'
import { TbReportSearch } from 'react-icons/tb'
import ReporteVentas from '../components/system-reports'

export function UsersPage() {
  const [employees, setEmployees] = useState([])
  const [roles, setRoles] = useState([])
  const [employeesStatus, setEmployeesStatus] = useState('loading')
  const [shouldRevalidate, revalidate] = useState(false)
  const [isLoadingBackup, setIsLoadingBackup] = useState(false)
  const employee = useSessionStore((state) => state.employee)
  const [, navigate] = useLocation()
  useBreadcrumbs({ breadcrumbs: ['Usuarios'] })

  useEffect(() => {
    if (employee.roles.role !== 'admin') {
      navigate('/home')
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

  const handleBackup = () => {
    setIsLoadingBackup(true)
    backup()
      .then((data) => {
        downloadJSON(JSON.stringify(data), 'backup.json')
      })
      .finally(() => {
        setIsLoadingBackup(false)
      })
  }

  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl font-semibold'>Administración</h2>
          <p className='text-sm text-neutral-600'>Acciones administrativas del sistema.</p>
        </div>
      </div>

      <div className='w-full rounded border bg-white'>
        <Tabs
          aria-label='Tabs with icons'
          variant='underline'
        >
          <Tabs.Item
            active
            title='Usuarios'
            icon={HiUserCircle}
          >
            <div className='px-2'>
              <UsersTable
                isLoading={employeesStatus === 'loading'}
                employees={employees}
                revalidate={() => revalidate((prev) => !prev)}
                roles={roles}
              />
            </div>
          </Tabs.Item>
          <Tabs.Item
            title='Respaldo'
            icon={GoDatabase}
          >
            <div className='px-2'>
              <div className='mb-2 flex justify-end'>
                <Button
                  color='light'
                  onClick={handleBackup}
                >
                  <div className='flex items-center gap-2'>
                    Generar respaldo{' '}
                    {isLoadingBackup ? (
                      <Spinner className='size-4' />
                    ) : (
                      <MdOutlineFileDownload className='size-6' />
                    )}
                  </div>
                </Button>
              </div>
              <div>
                <BackUpRestore />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item
            title='Reportes'
            icon={TbReportSearch}
          >
            <ReporteVentas />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  )
}
