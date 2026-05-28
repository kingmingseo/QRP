import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, type EditUserDto, type CreateUserDto, editUserSchema } from "@workspace/shared/schemas/registration"

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

  @Get('medical-info/:qrCode')
  async getMedicalInfoByQrCode(@Param('qrCode') qrCode: string) {
    return this.usersService.findPublicMedicalInfoByQrCode(qrCode)
  }

  @Patch('medical-info/:qrCode')
  async editMedicalInfoById(@Param('qrCode') qrCode: string, @Body() medicalInfo: EditUserDto) {
    const result = editUserSchema.safeParse(medicalInfo)
    
    return this.usersService.editMedicalInfoByQrCode(qrCode, medicalInfo)
  }
}
