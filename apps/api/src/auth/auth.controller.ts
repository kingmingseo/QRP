import { BadRequestException, Body, Controller, Get, Post, Req, Res } from "@nestjs/common"
import type { CookieOptions, Request, Response } from "express"
import { AuthService } from "./auth.service"
import { loginSchema, type LoginDto } from "@workspace/shared/schemas/login"

const getAccessTokenCookieOptions = (maxAge?: number): CookieOptions => {
  const secure =
    process.env.COOKIE_SECURE === "true" ||
    process.env.CORS_ORIGIN?.startsWith("https://")

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  }
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("me")
  async me(@Req() req: Request) {
    return this.authService.getCurrentUser(req.cookies?.accessToken)
  }

  @Post("login")
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {

    const result = loginSchema.safeParse(body)

    if (!result.success) {
      throw new BadRequestException(result.error.flatten())
    }
    const loginResult = await this.authService.login(body)

    res.cookie("accessToken", loginResult.accessToken, {
      ...getAccessTokenCookieOptions(1000 * 60 * 60),
    })

    return {
      user: loginResult.user,
    }
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("accessToken", getAccessTokenCookieOptions())

    return { success: true }
  }
}
