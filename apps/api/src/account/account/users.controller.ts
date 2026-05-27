import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { registrationSchema } from "@workspace/shared/schemas/registration"

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  register(@Body() body: unknown) {
    const result = registrationSchema.safeParse(body)

    if (!result.success) {
      throw new BadRequestException(result.error.flatten())
    }

    const dto = result.data
    return dto
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
