import { createBrowserRouter } from "react-router"

import { App } from "./App.tsx"

import { RegistrationPage } from "./pages/registration-page.tsx"
import LoginPage from "./pages/login-page.tsx"
import MedicalInfoPage from "./pages/medical-info-page.tsx"
import PageGuard from "./guard/page.guard.tsx"

function NotFoundPage() {
  return (
    <div className="flex min-h-svh justify-center bg-background text-foreground">
      <main className="flex w-full max-w-[430px] min-w-0 flex-col gap-3 px-5 py-8 text-sm leading-loose">
        <h1 className="font-medium">Page not found</h1>
        <a className="text-primary underline-offset-4 hover:underline" href="/">
          Go home
        </a>
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: (
      <PageGuard>
        <LoginPage />
      </PageGuard>
    ),
  },
  {
    path: "/registration",
    element: (
      <PageGuard>
        <RegistrationPage />
      </PageGuard>
    ),
  },
  {
    path: "/medical-info/:qrCode",
    element: <MedicalInfoPage />,
  },
])
