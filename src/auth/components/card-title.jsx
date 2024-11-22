export function CardTitle({ children, title, subtitle }) {
  return (
    <div className='text-center'>
      <h1 className='text-2xl font-semibold'>{title}</h1>
      <p className='mt-1 text-sm text-zinc-600 dark:text-gray-400'>{subtitle}</p>
      {children}
    </div>
  )
}
