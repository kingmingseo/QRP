import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./user/users.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".env.production"
          : ".env.development",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get<string>("DB_HOST"),
          port: Number(configService.get<string>("DB_PORT")),
          username: configService.get<string>("DB_USER"),
          password: configService.get<string>("DB_PASSWORD"),
          database: configService.get<string>("DB_NAME"),
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== "production",
        }
      }


    }),
      UsersModule,
      AuthModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],


})
export class AppModule { }
