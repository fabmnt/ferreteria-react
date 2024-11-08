import { useSessionStore } from '../store/session'

export function CurrentRoute() {
  const breadcrumbs = useSessionStore((state) => state.breadcrumbs)

  return breadcrumbs.map((label, index, arr) => (
    <div
      key={index}
      className='flex items-center gap-1'
    >
      <span
        key={label}
        className='rounded-lg border bg-white px-2 py-1 text-xs'
      >
        {label}
      </span>
      {index + 1 !== arr.length && <span className='text-xs text-neutral-600'>/</span>}
    </div>
  ))
}
