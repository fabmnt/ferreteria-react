import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  session: null,
  employee: null,
  breadcrumbs: [],
  setSession: (session) => set({ session }),
  setEmployee: (employee) => set({ employee }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}))
