import { useEffect } from 'react'
import { Link } from 'wouter'
import { useSessionStore } from '../hooks/useSession'
import { getEmployee } from '../services/users'
import { cn } from '../utils/cn'

export function DashboardLayout({ children }) {
  const session = useSessionStore((state) => state.session)
  const employee = useSessionStore((state) => state.employee)
  const setEmployee = useSessionStore((state) => state.setEmployee)

  useEffect(() => {
    if (session == null) {
      return
    }
    getEmployee(session.user.id).then(({ data }) => {
      setEmployee(data ? data[0] : null)
    })
  }, [session])

  return (
    <div className='flex min-h-screen w-full'>
      <div className='min-h-full p-2'>
        <aside className='flex h-full flex-col rounded-xl border p-2 shadow-sm'>
          <nav className='flex flex-col gap-2 text-sm'>
            <Link
              className={(active) =>
                cn(
                  'rounded-md px-3 py-2 font-semibold tracking-tight text-neutral-600 hover:bg-gray-200',
                  { 'bg-gray-200 text-black': active },
                )
              }
              to='/'
            >
              Dashboard
            </Link>
            {employee?.roles.role === 'admin' && (
              <Link
                className={(active) =>
                  cn(
                    'rounded-md px-3 py-2 font-semibold tracking-tight text-neutral-600 hover:bg-gray-200',
                    { 'bg-gray-200 text-black': active },
                  )
                }
                to='/admin'
              >
                Admin
              </Link>
            )}
          </nav>
          <div className='mb-2 mt-auto'>
            <p className='text-sm'>
              {employee?.name} {employee?.last_name}
            </p>
            <p className='text-xs text-neutral-500'>{session?.user.email}</p>
          </div>
        </aside>
      </div>
      <div className='flex-1 p-2'>{children}</div>
    </div>
  )
}
