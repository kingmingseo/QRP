import { useEffect, type ReactNode } from "react"

import { useAuthStore } from "@/store/auth.store"

type AuthBootstrapProps = {
  children: ReactNode
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return children
}
