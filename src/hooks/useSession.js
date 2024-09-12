import { useEffect } from 'react'
import { create } from 'zustand'
import { supabase } from '../db/supabase'

export const useSessionStore = create((set) => ({
  session: null,
  employee: null,
  setSession: (session) => set({ session }),
  setEmployee: (employee) => set({ employee }),
  clearSession: () => set({ session: null }),
}))

export function useSession() {
  const session = useSessionStore((state) => state.session)
  const setSession = useSessionStore((state) => state.setSession)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session }
}
