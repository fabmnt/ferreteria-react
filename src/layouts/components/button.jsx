import { cn } from '../../utils/cn'

export function Button({ children, variant = 'primary' }) {
  const colors = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-800 dark:text-white',
    secondary:
      'bg-transparent border-neutral-500 border hover:bg-gray-300 text-neutral-600 dark:border-neutral-500 dark:hover:bg-neutral-600 dark:text-neutral-300',
    danger: 'bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800',
    success: 'bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800',
  }

  return (
    <button
      className={cn('rounded px-4 py-2 text-sm font-semibold transition-colors', colors[variant])}
    >
      {children}
    </button>
  )
}

