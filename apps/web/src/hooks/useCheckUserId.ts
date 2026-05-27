// hooks/useCheckUserId.ts
import { useEffect, useState } from "react"

type Status = "idle" | "checking" | "available" | "taken"

export function useCheckUserId(userId: string) {
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    const id = userId.trim()

    if (!id) {
      setStatus("idle")
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      if (!id) {
        setStatus("idle")
        return
      }

      setStatus("checking")
      try {
        const params = new URLSearchParams({ userId: id })
        const res = await fetch(`/api/users/check-userid?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          setStatus("idle")
          return
        }

        const { available } = await res.json()
        setStatus(available ? "available" : "taken")
      } catch (error) {
        if (controller.signal.aborted) return
        setStatus("idle")
      }
    }, 500)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [userId])

  return status
}
