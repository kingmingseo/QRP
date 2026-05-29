import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AppService } from './app.service';
import { UsersService } from './user/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('q/:qrCode')
  async redirectQrCode(@Param('qrCode') qrCode: string, @Res() res: Response) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ??
      'http://localhost:5173'

    const targetPath = await this.usersService.checkQrCodeExists(qrCode)
      ? `/medical-info/${encodeURIComponent(qrCode)}`
      : '/404'

    return res.redirect(`${frontendUrl}${targetPath}`)
  }
}
