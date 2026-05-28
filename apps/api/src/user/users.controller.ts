import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, type CreateUserDto } from "@workspace/shared/schemas/registration"

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  register(@Body() userInfo: CreateUserDto) {
    const result = createUserSchema.safeParse(userInfo)

    if (!result.success) {
      throw new BadRequestException(result.error.flatten())
    }

    return this.usersService.createUser(userInfo)
  }

  @Get('check-userid')
  async checkDuplicateId(@Query('userId') userId?: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('userId is required')
    }

    const exists = await this.usersService.checkDuplicateId(userId.trim())
    return { available: !exists }
  }
}
