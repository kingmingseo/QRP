import { create } from "zustand"

import { getMyMedicalInfo, type MedicalInfo } from "@/api/user.api"

type AuthStatus = "checking" | "guest" | "authenticated"

type AuthState = {
  status: AuthStatus
  user: MedicalInfo | null
  checkAuth: () => Promise<void>
  setAuthenticated: (user?: MedicalInfo | null) => void
  setGuest: () => void
}

let checkAuthPromise: Promise<void> | null = null

export const useAuthStore = create<AuthState>((set) => ({
  status: "checking",
  user: null,
  checkAuth: async () => {
    if (checkAuthPromise) return checkAuthPromise

    checkAuthPromise = (async () => {
      set({ status: "checking" })

      try {
        const user = await getMyMedicalInfo()
        set({ status: "authenticated", user })
      } catch {
        set({ status: "guest", user: null })
      } finally {
        checkAuthPromise = null
      }
    })()

    return checkAuthPromise
  },
  setAuthenticated: (user = null) => {
    set({ status: "authenticated", user })
  },
  setGuest: () => {
    set({ status: "guest", user: null })
  },
}))
