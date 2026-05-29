import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.CORS_ORIGIN)
  app.use(cookieParser())

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
