import type { CSSProperties, ReactNode } from "react"
import { Link } from "react-router"
import { ChevronRight, HeartPulse, ShieldCheck, Siren } from "lucide-react"
import { Analytics } from "@vercel/analytics/next"
import { logout as requestLogout } from "@/api/user.api"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@workspace/ui/components/button"

export function App() {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const setGuest = useAuthStore((state) => state.setGuest)
  const isAuthenticated = status === "authenticated"
  const medicalInfoPath = user?.qrCode ? `/medical-info/${user.qrCode}` : "/login"

  async function handleLogout() {
    try {
      await requestLogout()
    } finally {
      setGuest()
    }
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="relative isolate min-h-svh overflow-hidden bg-zinc-950 text-white">
        <SpeedBackground />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-8">
          <SportBikeVisual />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.05),rgba(9,9,11,0.22)_38%,rgba(9,9,11,0.96)_78%)]" />

        <div className="relative z-10 flex min-h-svh flex-col px-5 pb-8 pt-5">
          <header className="flex items-center justify-end">
            {status === "checking" ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="h-9 border-white/20 bg-white/5 text-white"
              >
                확인 중
              </Button>
            ) : isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="h-9 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                로그아웃
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/login">로그인</Link>
              </Button>
            )}
          </header>

          <div className="flex flex-1 flex-col justify-end gap-7 pb-8">
            <div className="grid gap-4">
              <div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur">
                <span className="size-1.5 rounded-full bg-red-500" />
                Rider medical QR sticker
              </div>

              <div className="grid gap-3">
                <h1 className="max-w-[300px] text-[2rem] font-semibold leading-[1.08] tracking-normal">
                  사고 순간,
                  <br />
                  QR이 먼저 말합니다.
                </h1>
                <p className="max-w-[310px] text-sm leading-6 text-zinc-300">
                  헬멧의 QR을 스캔하면 혈액형, 알레르기, 복용약,
                  긴급연락처를 바로 확인합니다.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 w-full bg-white text-zinc-950 hover:bg-zinc-200"
              >
                <Link to={isAuthenticated ? medicalInfoPath : "/registration"}>
                  {isAuthenticated ? "의료 정보 확인" : "QR 코드 등록"}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-background px-5 py-8">
        <div className="mx-auto grid max-w-[430px] gap-4">
          <p className="text-xs font-medium text-muted-foreground">
            Ride-ready safety layer
          </p>
          <h2 className="max-w-[330px] text-2xl font-semibold leading-tight">
            구조자가 먼저 봐야 할 정보만 빠르게 보여줍니다.
          </h2>
          <div className="grid gap-2">
            <FeatureRow
              icon={<HeartPulse className="size-4" />}
              title="응급 의료정보"
              description="혈액형, 기저질환, 알레르기, 복용약을 빠르게 확인합니다."
            />
            <FeatureRow
              icon={<Siren className="size-4" />}
              title="긴급연락처"
              description="보호자나 지인에게 바로 연락할 수 있는 번호를 제공합니다."
            />
            <FeatureRow
              icon={<ShieldCheck className="size-4" />}
              title="QR 기반 접근"
              description="로그인 없이 QR 코드 값으로 공개 의료정보를 조회합니다."
            />
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-5 py-8 text-white">
        <div className="mx-auto grid max-w-[430px] gap-5">
          <div className="grid gap-2">
            <p className="text-xs font-medium text-zinc-400">How it works</p>
            <h2 className="max-w-[320px] text-2xl font-semibold leading-tight">
              스캔부터 확인까지, 세 단계면 충분합니다.
            </h2>
          </div>
          <div className="grid gap-3">
            <FlowStep
              index="01"
              title="헬멧에 QR 스티커 부착"
              description="라이더가 구매한 QR 코드를 계정과 연결합니다."
            />
            <FlowStep
              index="02"
              title="사고 현장에서 QR 스캔"
              description="구조자는 별도 앱 없이 모바일 카메라로 접근합니다."
            />
            <FlowStep
              index="03"
              title="의료정보 확인"
              description="응급처치에 필요한 핵심 정보만 즉시 표시합니다."
            />
          </div>
        </div>
      </section>
      <Analytics />
    </main>
  )
}

function SpeedBackground() {
  const lines = Array.from({ length: 30 }, (_, index) => ({
    top: `${10 + ((index * 23) % 66)}%`,
    width: `${58 + (index % 5) * 34}px`,
    left: `${(index * 8.1) % 90}%`,
    delay: `${(index * 0.17) % 2}s`,
    duration: `${0.5 + (index % 4) * 0.12}s`,
    red: index % 8 === 0,
    opacity: index % 8 === 0 ? 0.68 : 0.24 + (index % 3) * 0.08,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes speedline {
          0% { transform: translateX(0) scaleX(1); opacity: var(--op); }
          45% { transform: translateX(-55px) scaleX(1.32); opacity: var(--op); }
          100% { transform: translateX(-140px) scaleX(0.3); opacity: 0; }
        }
        .speed-line {
          position: absolute;
          height: 1.6px;
          border-radius: 999px;
          animation: speedline var(--dur) var(--delay) linear infinite;
          opacity: 0;
        }
        @keyframes redburst {
          0%, 100% { opacity: .11; transform: translateX(-50%) scale(1); }
          50% { opacity: .22; transform: translateX(-50%) scale(1.05); }
        }
        .red-glow {
          position: absolute;
          left: 50%;
          top: 18%;
          width: 72vw;
          height: 60vw;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(220,38,38,0.24) 0%, transparent 68%);
          animation: redburst 3.8s ease-in-out infinite;
        }
      `}</style>
      <div className="red-glow" />
      {lines.map((line, index) => (
        <div
          key={index}
          className="speed-line"
          style={
            {
              top: line.top,
              width: line.width,
              left: line.left,
              background: line.red ? "rgb(220,38,38)" : "rgb(244,244,245)",
              "--op": line.opacity,
              "--dur": line.duration,
              "--delay": line.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function SportBikeVisual() {
  return (
    <img
      src="/images/red-sport-bike-hero.png"
      alt=""
      className="h-[72svh] w-full max-w-[430px] object-cover object-center opacity-95"
      draggable={false}
    />
  )
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-card p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
        {icon}
      </div>
      <div className="grid gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function FlowStep({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description: string
}) {
  return (
    <div className="grid gap-2 border-l border-white/15 pl-4">
      <span className="text-xs font-medium text-red-400">{index}</span>
      <div className="grid gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs leading-5 text-zinc-400">{description}</p>
      </div>
    </div>
  )
}
