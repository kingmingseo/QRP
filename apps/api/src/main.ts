import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim())
  app.use(cookieParser())

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
