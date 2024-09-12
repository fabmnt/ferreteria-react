import { Link } from 'wouter'
import { cn } from '../utils/cn'

export function DashboardLayout({ children }) {
  return (
    <div className='flex min-h-screen w-full'>
      <div className='min-h-full p-2'>
        <aside className='h-full w-[180px] rounded-xl border px-2 pt-4 shadow-sm'>
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
          </nav>
        </aside>
      </div>
      <div className='flex-1 p-2'>{children}</div>
    </div>
  )
}
