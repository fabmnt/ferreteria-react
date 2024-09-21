import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  session: null,
  employee: null,
  setSession: (session) => set({ session }),
  setEmployee: (employee) => set({ employee }),
}))
