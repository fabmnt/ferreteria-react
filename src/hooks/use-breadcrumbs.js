import { useEffect } from 'react'
import { useSessionStore } from '../store/session'

export function useBreadcrumbs({ breadcrumbs }) {
  const setBreadcrumbs = useSessionStore((state) => state.setBreadcrumbs)

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, [breadcrumbs])
}
