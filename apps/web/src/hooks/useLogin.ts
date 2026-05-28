// apps/web/src/hooks/useLogin.ts
import { useState } from "react"
import type { LoginDto } from "@workspace/shared"
import { login } from "@/api/user.api"
import axios from "axios"

type LoginStatus = "idle" | "loading" | "success" | "error"

export function useLogin() {
  const [status, setStatus] = useState<LoginStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  async function loginUser(values: LoginDto) {
    setStatus("loading")
    setErrorMessage("")

    try {
      const result = await login(values)
      setStatus("success")
      return result
    } catch (error) {
      setStatus("error")

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "서버 통신 에러 발생",
        )
      } else {
        setErrorMessage("서버 통신 에러 발생")
      }

      throw error
    }
  }

  return {
    loginUser,
    status,
    errorMessage,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
  }
}
