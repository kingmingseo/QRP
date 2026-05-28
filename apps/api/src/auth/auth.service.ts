import { Injectable, UnauthorizedException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import type { LoginDto } from "@workspace/shared/schemas/login"
import { UsersService } from "src/user/users.service"
import { JwtService } from "@nestjs/jwt"

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
    console.log('로그인성공')
    return {
      accessToken,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
      }
    }
  }
}