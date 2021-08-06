import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GameGateway } from './app.gamegateway';
import { BorderlessGateway } from './app.borderlessgateway';
import { ChatGateway } from './chat/app.chatgateway';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    AuthModule,
    ChatModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        //...
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway, ChatGateway, BorderlessGateway],
})
export class AppModule {}
