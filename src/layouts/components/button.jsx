import { cn } from '../../utils/cn'

export function Button({ children, variant = 'primary' }) {
  const colors = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary: 'bg-transparent border-neutral-500 border hover:bg-gray-300 text-neutral-600',
    danger: 'bg-red-500 hover:bg-red-700',
    success: 'bg-green-500 hover:bg-green-700',
  }

  return (
    <button
      className={cn('rounded px-4 py-2 text-sm font-semibold transition-colors', colors[variant])}
    >
      {children}
    </button>
  )
}
