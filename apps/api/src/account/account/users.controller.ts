import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
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
}
