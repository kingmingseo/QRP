import { Link, useNavigate } from "react-router"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginDto } from "@workspace/shared"
import { useForm } from "react-hook-form"
import { FieldError } from "@workspace/ui/components/fieldError"
import { useLogin } from "@/hooks/useLogin"
import { useAuthStore } from "@/store/auth.store"

export default function LoginPage() {
  const navigate = useNavigate()
  const checkAuth = useAuthStore((state) => state.checkAuth)

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  })

  const { loginUser, isLoading, errorMessage } = useLogin()

  async function onSubmit(values: LoginDto) {
    await loginUser(values)
    await checkAuth()
    const qrCode = useAuthStore.getState().user?.qrCode
    navigate(qrCode ? `/medical-info/${qrCode}` : "/")
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground">
      <Card className="w-full max-w-[430px] shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription className="text-xs">
            로그인을 통해 의료정보를 등록 및 수정 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="user-id">아이디</Label>
              <Input
                id="user-id"
                type="text"
                placeholder="아이디를 입력해주세요"
                {...form.register("userId")}
              />
              <FieldError message={form.formState.errors.userId?.message} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">비밀번호</Label>
                <a
                  href="#"
                  className="text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline"
                >
                  비밀번호 찾기
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                autoComplete="current-password"
                {...form.register("password")}
              />
            </div>
            
            {errorMessage && <FieldError message={errorMessage}></FieldError>}

            <Button type="submit" className="w-full">
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>

          </form>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            계정이 없나요?{" "}
            <Link
              to="/registration"
              className="text-primary underline-offset-4 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </main >
  )
}
