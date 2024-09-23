import { cn } from '../utils/cn'

export function Badge({ children, variant = 'success' }) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-800',
        colors[variant],
      )}
    >
      {children}
    </span>
  )
}
