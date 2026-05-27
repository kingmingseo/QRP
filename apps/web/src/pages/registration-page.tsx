import { useState } from "react"
import { Controller, type UseFormReturn, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Link } from "react-router"

import { registrationSchema, type RegistrationDto } from "@workspace/shared"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Calendar } from "@workspace/ui/components/calendar"
import { FieldError } from "@workspace/ui/components/fieldError"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useCheckUserId } from "../hooks/useCheckUserId"

type RegistrationStep = "account" | "health" | "personal"
type DuplicateStatus = "idle" | "checking" | "available" | "taken"

const accountFields = ["userId", "password", "passwordConfirm"] as const
const personalFields = ["name", "birthDate", "gender"] as const

export function RegistrationPage() {
  const [step, setStep] = useState<RegistrationStep>("account")

  const isHealthStep = step === "health"
  const isPersonalStep = step === "personal"

  const form = useForm<RegistrationDto>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      userId: "",
      password: "",
      passwordConfirm: "",
      name: "",
      birthDate: "",
      gender: "unknown",
      bloodType: "unknown",
      illness: "",
      medications: "",
      allergies: "",
    },
  })

  const userId = useWatch({
    control: form.control,
    name: "userId",
    defaultValue: "",
  })

  const duplicateStatus = useCheckUserId(userId)

  async function handleNextAccount() {
    const isValid = await form.trigger(accountFields)
    if (!isValid) return

    if (duplicateStatus === "checking") {
      form.setError("userId", { message: "아이디 중복 확인 중입니다." })
      return
    }

    if (duplicateStatus === "taken") {
      form.setError("userId", { message: "이미 사용 중인 아이디입니다." })
      return
    }

    if (duplicateStatus !== "available") {
      form.setError("userId", { message: "아이디 중복 확인을 완료해주세요." })
      return
    }

    setStep("personal")
  }

  async function handleNextPersonal() {
    const isValid = await form.trigger(personalFields)
    if (isValid) {
      setStep("health")
    }
  }

  async function onSubmit(values: RegistrationDto) {
    console.log(values)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground">
      <Card className="w-full max-w-[430px] shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-primary" />
            <div
              className={
                isHealthStep || isPersonalStep
                  ? "h-1.5 flex-1 rounded-full bg-primary"
                  : "h-1.5 flex-1 rounded-full bg-muted"
              }
            />
            <div
              className={
                isHealthStep
                  ? "h-1.5 flex-1 rounded-full bg-primary"
                  : "h-1.5 flex-1 rounded-full bg-muted"
              }
            />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl">
              {isHealthStep ? "건강 정보" : isPersonalStep ? "개인 정보" : "회원가입"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isHealthStep
                ? "응급 상황에서 구조자가 확인할 수 있는 의료 정보를 입력하세요."
                : isPersonalStep
                  ? "본인 확인에 필요한 기본 정보를 입력하세요."
                  : "QRP 이용을 위한 계정을 생성하세요."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            {isHealthStep ? (
              <HealthFields form={form} />
            ) : isPersonalStep ? (
              <PersonalInfo form={form} />
            ) : (
              <AccountFields form={form} duplicateStatus={duplicateStatus} />
            )}

            <div key={step}>
              {isHealthStep ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("personal")}
                  >
                    이전
                  </Button>
                  <Button type="submit" className="w-full">
                    제출
                  </Button>
                </div>
              ) : isPersonalStep ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("account")}
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleNextPersonal}
                  >
                    다음
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  disabled={duplicateStatus === "checking"}
                  onClick={handleNextAccount}
                >
                  다음
                </Button>
              )}
            </div>
          </form>

          {!isHealthStep && !isPersonalStep && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              이미 계정이 있나요?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                로그인
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function AccountFields({
  form,
  duplicateStatus,
}: {
  form: UseFormReturn<RegistrationDto>
  duplicateStatus: DuplicateStatus
}) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="user-id">아이디</Label>
        <Input
          id="user-id"
          type="text"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          {...form.register("userId")}
        />

        {duplicateStatus === "checking" && (
          <p className="text-xs text-muted-foreground">확인 중...</p>
        )}
        {duplicateStatus === "available" && (
          <p className="text-xs text-green-500">사용 가능한 아이디입니다.</p>
        )}
        {duplicateStatus === "taken" && (
          <p className="text-xs text-red-500">이미 사용 중인 아이디입니다.</p>
        )}
        <FieldError message={form.formState.errors.userId?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="8자 이상"
          autoComplete="new-password"
          {...form.register("password")}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password-confirm">비밀번호 확인</Label>
        <Input
          id="password-confirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          autoComplete="new-password"
          {...form.register("passwordConfirm")}
        />
        <FieldError message={form.formState.errors.passwordConfirm?.message} />
      </div>
    </>
  )
}

function HealthFields({ form }: { form: UseFormReturn<RegistrationDto> }) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="bloodType">혈액형</Label>
        <Controller
          control={form.control}
          name="bloodType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="bloodType" className="w-full">
                <SelectValue placeholder="혈액형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="unknown">모름</SelectItem>
                  <SelectItem value="A+">A형 RH+</SelectItem>
                  <SelectItem value="A-">A형 RH-</SelectItem>
                  <SelectItem value="B+">B형 RH+</SelectItem>
                  <SelectItem value="B-">B형 RH-</SelectItem>
                  <SelectItem value="O+">O형 RH+</SelectItem>
                  <SelectItem value="O-">O형 RH-</SelectItem>
                  <SelectItem value="AB+">AB형 RH+</SelectItem>
                  <SelectItem value="AB-">AB형 RH-</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={form.formState.errors.bloodType?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="illness">기저질환</Label>
        <Input
          id="illness"
          type="text"
          placeholder="예: 고혈압"
          {...form.register("illness")}
        />
        <FieldError message={form.formState.errors.illness?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="medications">복용 중인 약</Label>
        <Input
          id="medications"
          type="text"
          placeholder="예: 아스피린"
          {...form.register("medications")}
        />
        <FieldError message={form.formState.errors.medications?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="allergies">알레르기</Label>
        <Input
          id="allergies"
          type="text"
          placeholder="예: 갑각류 알레르기"
          {...form.register("allergies")}
        />
        <FieldError message={form.formState.errors.allergies?.message} />
      </div>
    </>
  )
}

function PersonalInfo({ form }: { form: UseFormReturn<RegistrationDto> }) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          placeholder="이름을 입력하세요"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="birth-date">생년월일</Label>
        <Controller
          control={form.control}
          name="birthDate"
          render={({ field }) => {
            const selectedDate = field.value ? new Date(field.value) : undefined

            return (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="birth-date"
                      className="justify-start font-normal"
                    >
                      {field.value ? (
                        format(selectedDate!, "PPP")
                      ) : (
                        <span className="text-muted-foreground">
                          날짜를 선택하세요
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      defaultMonth={selectedDate}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FieldError message={form.formState.errors.birthDate?.message} />
              </>
            )
          }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="gender">성별</Label>
        <Controller
          control={form.control}
          name="gender"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="unknown">모름</SelectItem>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={form.formState.errors.gender?.message} />
      </div>
    </>
  )
}
