import type { ReactNode } from "react"
import { Navigate } from "react-router"

import { useAuthStore } from "@/store/auth.store"

type PageGuardProps = {
  children: ReactNode
}

export default function PageGuard({ children }: PageGuardProps) {
  const status = useAuthStore((state) => state.status)

  if (status === "checking") {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground">
        <p className="text-sm text-muted-foreground">로그인 상태 확인 중...</p>
      </main>
    )
  }

  if (status === "authenticated") {
    const qrCode = useAuthStore.getState().user?.qrCode
    return <Navigate to={qrCode ? `/medical-info/${qrCode}` : "/"} replace />
  }

  return children
}
