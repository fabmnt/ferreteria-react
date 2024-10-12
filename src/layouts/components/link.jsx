import { Link } from 'wouter'
import { cn } from '../../utils/cn'

export function LayoutLink({ children, isActive, to }) {
  return (
    <div className='relative w-full px-4'>
      <Link
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 font-semibold tracking-tight text-neutral-600 hover:bg-gray-200',
          { 'bg-gray-200 text-black': isActive },
        )}
        to={to}
      >
        {children}
        <span
          className={cn(
            'absolute left-0 hidden h-[55%] w-1 rounded-r-3xl bg-black',
            isActive && 'block',
          )}
        />
      </Link>
    </div>
  )
}
