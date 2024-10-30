import { useRoute } from 'wouter'
import { routes } from '../constants/routes'

export function CurrentRoute({ pathToMatch }) {
  const [match] = useRoute(pathToMatch)

  if (!match) {
    return null
  }
  const labels =
    routes.find((route) => {
      return route.path === pathToMatch
    })?.labels ?? []

  return labels.map((label) => (
    <div
      key={label}
      className='flex items-center gap-1'
    >
      <span>/</span>
      <span
        key={label}
        className='rounded-lg border bg-white px-2 py-1 text-xs'
      >
        {label}
      </span>
    </div>
  ))
}
