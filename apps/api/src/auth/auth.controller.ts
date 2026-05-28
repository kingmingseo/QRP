import { BadRequestException, Body, Controller, Post, Res } from "@nestjs/common"
import type { Response } from "express"
import { AuthService } from "./auth.service"
import { loginSchema, type LoginDto } from "@workspace/shared/schemas/login"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    })

    return {
      user: loginResult.user,
    }
  }
}