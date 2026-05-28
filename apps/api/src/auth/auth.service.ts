import { Injectable, UnauthorizedException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import type { LoginDto } from "@workspace/shared/schemas/login"
import { UsersService } from "src/user/users.service"
import { JwtService } from "@nestjs/jwt"
import type { User } from "src/user/users.entity"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUserId(dto.userId)

    if (!user) {
      throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.")
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.")
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      userId: user.userId,
    })

    return {
      accessToken,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
      }
    }
  }

  async getCurrentUser(accessToken?: string): Promise<Omit<User, "password">> {
    if (!accessToken) {
      throw new UnauthorizedException("로그인이 필요합니다.")
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ userId: string }>(accessToken)
      const user = await this.usersService.findByUserId(payload.userId)

      if (!user) {
        throw new UnauthorizedException("사용자를 찾을 수 없습니다.")
      }

      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch {
      throw new UnauthorizedException("로그인이 필요합니다.")
    }
  }
}
