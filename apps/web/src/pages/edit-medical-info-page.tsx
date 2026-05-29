import { useEffect, useState } from "react"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Loader2 } from "lucide-react"
import { editUserSchema, type EditUserDto } from "@workspace/shared"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
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
import { editMedicalInfoByQrCode, getMedicalInfoByQrCode } from "@/api/user.api"

type EditStep = "health" | "personal"

const personalFields = ["name", "birthDate", "gender"] as const

export function EditMedicalInfoPage() {
  const navigate = useNavigate()
  const { qrCode } = useParams()
  const [step, setStep] = useState<EditStep>("personal")
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

  const isHealthStep = step === "health"
  const isPersonalStep = step === "personal"

  const form = useForm<EditUserDto>({
    resolver: zodResolver(editUserSchema),
    mode: "onChange",
  })


  useEffect(() => {
    if (!isSuccessDialogOpen) return

    const redirectTimer = window.setTimeout(() => {
      navigate(`/medical-info/${qrCode}`)
    }, 3000)

    return () => window.clearTimeout(redirectTimer)
  }, [isSuccessDialogOpen, navigate])

  async function handleNextPersonal() {
    const isValid = await form.trigger(personalFields)
    if (!isValid) return

    setStep("health")
  }


  async function onSubmit(values: EditUserDto) {
    if (!qrCode) {
      return
    }

    await editMedicalInfoByQrCode(qrCode, values)
    setIsSuccessDialogOpen(true)
  }

  useEffect(() => {
    async function loadMedicalInfo() {
      if (!qrCode) return

      const data = await getMedicalInfoByQrCode(qrCode)
      console.log(data)
      form.reset({
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender,
        bloodType: data.bloodType,
        illness: data.illness ?? "",
        medications: data.medications ?? "",
        allergies: data.allergies ?? "",
        emergencyContact1: data.emergencyContact1,
        emergencyContact2: data.emergencyContact2 ?? "",
      })
    }

    loadMedicalInfo()
  }, [qrCode, form])

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground">
      <Dialog open={isSuccessDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>개인 정보 수정이 완료되었습니다</DialogTitle>
            <DialogDescription>
              3초 뒤 정보 페이지로 이동합니다.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-[430px] shadow-none">
        <CardHeader className="space-y-3">
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2"
              onClick={() => {
                if (qrCode) {
                  navigate(`/medical-info/${qrCode}`)
                  return
                }

                navigate(-1)
              }}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              뒤로가기
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-primary" />
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
              {isHealthStep ? "건강 정보 수정 " : "개인 정보 수정"}
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
            ) :
              <PersonalInfo form={form} />

            }
            <div key={step}>
              {isHealthStep ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                    onClick={() => setStep("personal")}
                  >
                    이전
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                    aria-busy={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    )}
                    제출
                  </Button>
                </div>
              ) :
                <div className="grid gap-3">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleNextPersonal}
                  >
                    다음
                  </Button>
                </div>
              }
            </div>
          </form>

        </CardContent>
      </Card>
    </main >
  )
}

function RequiredBadge() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  )
}

function HealthFields({ form }: { form: UseFormReturn<EditUserDto> }) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="bloodType">
          혈액형
          <RequiredBadge />
        </Label>
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

      <div className="grid gap-2">
        <Label htmlFor="emergency-contact-1">
          긴급연락처 1
          <RequiredBadge />
        </Label>
        <Input
          id="emergency-contact-1"
          type="tel"
          placeholder="예: 010-1234-5678"
          autoComplete="tel"
          {...form.register("emergencyContact1")}
        />
        <FieldError message={form.formState.errors.emergencyContact1?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="emergency-contact-2">긴급연락처 2</Label>
        <Input
          id="emergency-contact-2"
          type="tel"
          placeholder="예: 010-9876-5432"
          autoComplete="tel"
          {...form.register("emergencyContact2")}
        />
        <FieldError message={form.formState.errors.emergencyContact2?.message} />
      </div>
    </>
  )
}

function PersonalInfo({ form }: { form: UseFormReturn<EditUserDto> }) {
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">
          이름
          <RequiredBadge />
        </Label>
        <Input
          id="name"
          placeholder="이름을 입력하세요"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="birth-date">
          생년월일
          <RequiredBadge />
        </Label>
        <Controller
          control={form.control}
          name="birthDate"
          render={({ field }) => {
            const selectedDate = field.value ? new Date(field.value) : undefined

            return (
              <>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
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
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        setDatePickerOpen(false)
                      }
                      }
                      captionLayout="dropdown"
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
        <Label htmlFor="gender">
          성별
          <RequiredBadge />
        </Label>
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
