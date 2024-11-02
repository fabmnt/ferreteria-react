import { useRoute, useParams } from 'wouter'
import { routes } from '../constants/routes'

export function CurrentRoute({ pathToMatch }) {
  const [match] = useRoute(pathToMatch)
  const params = useParams()

  if (!match) {
    return null
  }

  const labels =
    routes.find((route) => {
      return route.path.replace(':id', params[0] ?? '') === pathToMatch
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
