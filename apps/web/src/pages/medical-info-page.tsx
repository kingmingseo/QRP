import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router"
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Droplets,
  IdCard,
  Phone,
  Pill,
  UserRound,
} from "lucide-react"
import axios from "axios"

import { getMyMedicalInfo, type MedicalInfo } from "@/api/user.api"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const genderLabels: Record<string, string> = {
  unknown: "모름",
  male: "남성",
  female: "여성",
  other: "기타",
}

export default function MedicalInfoPage() {
  const navigate = useNavigate()
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function loadMedicalInfo() {
      try {
        const data = await getMyMedicalInfo()
        setMedicalInfo(data)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login")
          return
        }

        setErrorMessage("의료 정보를 불러오지 못했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadMedicalInfo()
  }, [navigate])

  const age = useMemo(() => {
    if (!medicalInfo?.birthDate) return null

    const birthDate = new Date(medicalInfo.birthDate)
    if (Number.isNaN(birthDate.getTime())) return null

    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge -= 1
    }

    return calculatedAge
  }, [medicalInfo?.birthDate])

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground">
        <p className="text-sm text-muted-foreground">의료 정보를 불러오는 중...</p>
      </main>
    )
  }

  if (errorMessage || !medicalInfo) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground">
        <div className="grid w-full max-w-[430px] gap-4">
          <p className="text-sm text-destructive">{errorMessage}</p>
          <Button asChild>
            <Link to="/login">로그인으로 이동</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5 px-5 py-6 sm:py-8">
        <section className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IdCard className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold leading-tight">
                  {medicalInfo.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  응급 상황에서 확인할 수 있는 의료 정보입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryItem
              icon={<Droplets className="size-4" />}
              label="혈액형"
              value={displayValue(medicalInfo.bloodType)}
            />
            <SummaryItem
              icon={<UserRound className="size-4" />}
              label="성별"
              value={genderLabels[medicalInfo.gender] ?? medicalInfo.gender}
            />
            <SummaryItem
              icon={<CalendarDays className="size-4" />}
              label="나이"
              value={age === null ? medicalInfo.birthDate : `${age}세`}
            />
            <SummaryItem
              icon={<Phone className="size-4" />}
              label="긴급연락처"
              value={medicalInfo.emergencyContact1}
            />
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoSection
            title="기본 정보"
            description="본인 확인에 필요한 정보"
            items={[
              { label: "아이디", value: medicalInfo.userId },
              { label: "이름", value: medicalInfo.name },
              { label: "생년월일", value: medicalInfo.birthDate },
              { label: "성별", value: genderLabels[medicalInfo.gender] ?? medicalInfo.gender },
            ]}
          />

          <InfoSection
            title="긴급 연락처"
            description="응급 상황에서 연락할 번호"
            items={[
              { label: "긴급연락처 1", value: medicalInfo.emergencyContact1 },
              { label: "긴급연락처 2", value: medicalInfo.emergencyContact2 },
            ]}
          />
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" />
              의료 정보
            </CardTitle>
            <CardDescription>구조자와 의료진에게 필요한 건강 정보</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <MedicalRow
              icon={<Droplets className="size-4" />}
              label="혈액형"
              value={displayValue(medicalInfo.bloodType)}
            />
            <MedicalRow
              icon={<AlertTriangle className="size-4" />}
              label="기저질환"
              value={medicalInfo.illness}
            />
            <MedicalRow
              icon={<Pill className="size-4" />}
              label="복용 중인 약"
              value={medicalInfo.medications}
            />
            <MedicalRow
              icon={<AlertTriangle className="size-4" />}
              label="알레르기"
              value={medicalInfo.allergies}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="grid min-w-0 gap-2 rounded-lg border bg-background p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="truncate text-sm font-medium">{value}</p>
    </div>
  )
}

function InfoSection({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: Array<{ label: string; value?: string | null }>
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="min-w-0 truncate text-right text-sm font-medium">
              {displayValue(item.value)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function MedicalRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 break-words text-sm text-muted-foreground">
          {displayValue(value)}
        </p>
      </div>
    </div>
  )
}

function displayValue(value?: string | null) {
  if (!value || value === "unknown") return "미입력"
  return value
}
