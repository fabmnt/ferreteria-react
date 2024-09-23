import { HiOutlineUsers } from 'react-icons/hi2'
import { RxDashboard } from 'react-icons/rx'
import { TiDocumentText } from 'react-icons/ti'
import { Link } from 'wouter'
import { useSessionStore } from '../store/session'
import { cn } from '../utils/cn'
import { hasRoles } from '../utils/users'

export function DashboardLayout({ children }) {
  const session = useSessionStore((state) => state.session)
  const employee = useSessionStore((state) => state.employee)

  return (
    <div className='flex min-h-screen w-full'>
      <div className='min-h-full'>
        <aside className='flex h-full flex-col border px-2.5 py-2 shadow-sm'>
          <h1 className='mb-6 mt-2 text-sm font-semibold'>Ferretería</h1>
          <nav className='flex flex-col gap-2 text-sm'>
            <Link
              className={(active) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 font-semibold tracking-tight text-neutral-600 hover:bg-gray-200',
                  { 'bg-gray-200 text-black': active },
                )
              }
              to='/'
            >
              <RxDashboard className='h-6 w-5' />
              Dashboard
            </Link>
            {hasRoles(employee, 'admin') && (
              <Link
                className={(active) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 font-semibold tracking-tight text-neutral-600 hover:bg-gray-200',
                    { 'bg-gray-200 text-black': active },
                  )
                }
                to='/users'
              >
                <HiOutlineUsers className='h-6 w-5' />
                Usuarios
              </Link>
            )}
            {hasRoles(employee, 'admin', 'seller') && (
              <Link
                className={(active) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 font-semibold tracking-tight text-neutral-600 hover:bg-gray-200',
                    { 'bg-gray-200 text-black': active },
                  )
                }
                to='/bills/create'
              >
                <TiDocumentText className='h-6 w-5' />
                Nueva factura
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
      <div className='flex-1 px-12'>{children}</div>
    </div>
  )
}
