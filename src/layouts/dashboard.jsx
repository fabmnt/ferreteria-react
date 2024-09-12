import { Link } from 'wouter'
import { cn } from '../utils/cn'
import { useSession } from '../hooks/useSession'
import { useEffect, useState } from 'react'
import { getEmployee } from '../services/users'

export function DashboardLayout({ children }) {
  const { session } = useSession()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (session == null) {
      return
    }

    getEmployee(session.user.id).then(({ data }) => {
      setUser(data ? data[0] : null)
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
            {user?.roles.role === 'admin' && (
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
              {user?.name} {user?.last_name}
            </p>
            <p className='text-xs text-neutral-500'>{session?.user.email}</p>
          </div>
        </aside>
      </div>
      <div className='flex-1 p-2'>{children}</div>
    </div>
  )
}
